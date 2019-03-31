import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException, Logger } from '@nestjs/common';
import { Transaction, Op } from 'sequelize';
import _ from 'lodash';
import { Moment } from 'src/common/util/moment';
import { UserStockOrderService } from './user_stock_order.service';
import { ConstProvider } from 'src/constant/provider.const';
import { Sequelize } from 'sequelize-typescript';
import { StockService } from './stock.service';
import { ConstData } from 'src/constant/data.const';
import { UserStockOrder } from 'src/entity/sequelize/user_stock_order.entity';
import { Calc } from 'src/common/util/calc';
import { $ } from 'src/common/util/function';
import { UserStockService } from './user_stock.service';
import { UserCapitalService } from './user_capital.service';
import { StockOrderService } from './stock_order.service';

@Injectable()
export class OrderService {

    constructor(
        @Inject(ConstProvider.SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly userStockOrderService: UserStockOrderService,
        private readonly stockService: StockService,
        private readonly userStockService: UserStockService,
        private readonly userCapitalService: UserCapitalService,
        private readonly stockOrderService: StockOrderService,
    ) { }

    public async handle() {
        const stocks = await this.stockService.findAll();
        for (const stock of stocks) {
            Logger.log(`开始核算 ${stock.name}`);
            const newTransaction = await this.sequelize.transaction();
            const finalOrders = await this.calcOneStockFinalOrders(stock.id, newTransaction);
            Logger.log(`核算完毕成交单 ${stock.name}`);
            const trade = await this.trade(finalOrders, newTransaction);
            Logger.log(`资产交割完毕 ${stock.name}`);
            await this.updateQuotation(trade, newTransaction);
            Logger.log(`行情刷新结束 ${stock.name}`);
        }
    }

    private async updateQuotation(
        trade: {
            stockId: string,
            hand: number,
            price: number,
        },
        transaction: Transaction,
    ) {
        return this.stockService.update(trade.stockId, {
            finalPrice: trade.price,
            finalHand: trade.hand,
        }, transaction);
    }

    /**
     * 资产交割
     *
     * @param {{
     *         buyOrder: any,
     *         soldOrder: any,
     *         price: number,
     *         hand: number ,
     *     }[]} finalOrders
     * @returns
     * @memberof OrderService
     */
    private async trade(
        finalOrders: {
            buyOrder: any,
            soldOrder: any,
            price: number,
            hand: number,
        }[],
        transaction: Transaction,
    ) {
        for (const finalOrder of finalOrders) {
            const payOfBuyer = Calc.calcStockBuyCost(finalOrder.buyOrder.hand, finalOrder.price);

            // 扣减买方资金
            await this.userCapitalService.subtractUserCapital(
                finalOrder.buyOrder.userId,
                payOfBuyer,
                transaction,
            );
            // 增加卖方资金
            await this.userCapitalService.addUserCapital(
                finalOrder.soldOrder.userId,
                payOfBuyer,
                transaction,
            );
            // 增加买方股票
            await this.userStockService.addUserStock(
                finalOrder.buyOrder.userId,
                finalOrder.buyOrder.stockId,
                finalOrder.hand * 100,
                transaction,
            );
            // 扣减卖方股票
            await this.userStockService.subtractUserStock(
                finalOrder.soldOrder.userId,
                finalOrder.soldOrder.stockId,
                finalOrder.hand * 100,
                transaction,
            );

            // 写入成交的交易记录
            await this.stockOrderService.create({
                stockId: finalOrder.buyOrder.stockId,
                price: finalOrder.price,
                minute: Moment().format('HH:mm'),
                hand: finalOrder.hand,
            });
        }

        return {
            stockId: $.tail(finalOrders).buyOrder.stockId,
            price: $.tail(finalOrders).price,
            hand: $.tail(finalOrders).hand,
        };
    }

    /**
     * 计算撮合一只股票的成交数据
     *
     * @param {string} stockId
     * @param {Transaction} [transaction]
     * @returns
     * @memberof OrderService
     */
    private async calcOneStockFinalOrders(
        stockId: string,
        transaction: Transaction,
    ) {
        const readyPool = await this.userStockOrderService.findAllReadyByStockIdWithLock(stockId, transaction);

        const finalOrders: any[] = [];
        let finalOrder: any;
        do {
            finalOrder = this.matchTrade(readyPool);
            if (finalOrder != false) {
                finalOrders.push(finalOrder);
            }
        } while (finalOrder != false);

        return finalOrders;
    }

    /**
     * 撮合交易
     *
     * @private
     * @param {UserStockOrder[]} readyPool
     * @returns
     * @memberof OrderService
     */
    private matchTrade(
        readyPool: UserStockOrder[],
    ) {
        // 获取市价池 优先
        // TODO:
        // 获取限价池
        const limit_orders = _.filter(readyPool, { mode: ConstData.TRADE_MODE.LIMIT });

        // 获取最新订单
        const current_order = _(limit_orders).orderBy('time', 'desc').first();
        // 获取限价买单池 较高价格优先 时间优先
        const buy_orders = _(limit_orders).filter({ action: ConstData.TRADE_ACTION.BUY })
            .orderBy(['price', 'time'], ['desc', 'asc']).value();
        // 获取限价卖单池 较低价格优先 时间优先
        const sold_orders = _(limit_orders).filter({ action: ConstData.TRADE_ACTION.SOLD })
            .orderBy(['price', 'time'], ['asc', 'asc']).value();

        const final_order = this.calcFinalPrice(buy_orders, sold_orders, current_order);
        if (!final_order) {
            console.log('没有可以撮合的');
            return false;
        } else {
            if (final_order.buy_order.hand === final_order.sold_order.hand) {
                // 移除已经成交的订单
                _.remove(readyPool, final_order.buy_order);
                _.remove(readyPool, final_order.sold_order);
                // 执行交易
                return _.assign(final_order, { hand: final_order.buy_order.hand });
            } else if (final_order.buy_order.hand > final_order.sold_order.hand) {
                // 移除已经完全成交订单
                _.remove(readyPool, final_order.sold_order);
                // 将订单的买方和卖方的手数修改成一致
                const source = _.cloneDeep(final_order);
                source.buy_order.hand = final_order.sold_order.hand;
                // 扣减部分成交的手数
                const a = _.find(readyPool, final_order.buy_order) as any;
                a.hand -= final_order.sold_order.hand;
                // 执行交易
                return _.assign(source, { hand: final_order.sold_order.hand });
            } else if (final_order.buy_order.hand < final_order.sold_order.hand) {
                // 移除已经完全成交订单
                _.remove(readyPool, final_order.buy_order);
                // 将订单的买方和卖方的手数修改成一致
                const source = _.cloneDeep(final_order);
                source.sold_order.hand = final_order.buy_order.hand;
                // 扣减部分成交的手数
                const a = _.find(readyPool, final_order.sold_order) as any;
                a.hand -= final_order.buy_order.hand;
                // 执行交易
                return _.assign(source, { hand: final_order.buy_order.hand });
            } else {
                throw Error('计算买卖手数出现问题');
            }
        }
    }

    /**
     * 成交价规则
     *
     * @param {any[]} buyOrders
     * @param {any[]} soldOrders
     * @param {*} currentOrder
     * @returns
     * @memberof OrderService
     */
    private calcFinalPrice(buyOrders: any[], soldOrders: any[], currentOrder: any) {
        // 最高买入订单
        const highest_buy_order = _.first(buyOrders);
        // 最低卖出订单
        const lowest_sold_order = _.first(soldOrders);

        // 没有买单卖单, 无法交易
        if (!highest_buy_order && !lowest_sold_order) return false;

        // 最高买入价格 与 最低卖出价格 相同, 则立即成交
        if (highest_buy_order && lowest_sold_order &&
            highest_buy_order.price === lowest_sold_order.price) {
            return {
                buy_order: highest_buy_order,
                sold_order: lowest_sold_order,
                price: highest_buy_order.price,
            };
        }
        // 申报价格买入 > 最低卖出价格, 则以最低卖出价格成交
        else if (lowest_sold_order && currentOrder.action === ConstData.TRADE_ACTION.BUY &&
            currentOrder.price > lowest_sold_order.price) {
            return {
                buy_order: currentOrder,
                sold_order: lowest_sold_order,
                price: lowest_sold_order.price,
            };
        }
        // 申报价格卖出 < 最高买入价格, 则以最高买入价格成交
        else if (highest_buy_order && currentOrder.action === ConstData.TRADE_ACTION.SOLD &&
            currentOrder.price < highest_buy_order.price) {
            return {
                buy_order: highest_buy_order,
                sold_order: currentOrder,
                price: highest_buy_order.price,
            };
        }
        // 撮合失败
        else {
            return false;
        }
    }

}
