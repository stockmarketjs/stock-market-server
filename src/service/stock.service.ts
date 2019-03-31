import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { StockDao } from 'src/dao/stock.dao';
import { StockUpdateDto, StockFindAllDto } from 'src/dto/stock/stock.dto';
import { ConstProvider } from 'src/constant/provider.const';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import _ from 'lodash';
import { StockCapitalDao } from 'src/dao/stock_capital.dao';
import { Calc } from 'src/common/util/calc';
import { Moment } from 'src/common/util/moment';
import { UserCapitalService } from './user_capital.service';
import { $ } from 'src/common/util/function';
import { ConstData } from 'src/constant/data.const';
import { UserStockService } from './user_stock.service';
import { UserStockOrderService } from './user_stock_order.service';

@Injectable()
export class StockService extends BaseService {

    constructor(
        @Inject(ConstProvider.SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly stockDao: StockDao,
        private readonly stockCapitalDao: StockCapitalDao,
        private readonly userCapitalService: UserCapitalService,
        private readonly userStockService: UserStockService,
        private readonly userStockOrderService: UserStockOrderService,
    ) {
        super();
    }

    public async findOneById(
        id: string,
        transaction?: Transaction,
    ) {
        return this.stockDao.findOne({ where: { id }, transaction });
    }

    public async findOneByIdOrThrow(
        id: string,
        transaction?: Transaction,
    ) {
        const stock = await this.findOneById(id, transaction);
        if (!stock) throw new NotFoundException();
        return stock;
    }

    public async findAll(
        transaction?: Transaction,
    ): Promise<StockFindAllDto[]> {
        const stocks = await this.stockDao.findAll({ transaction });
        for (const stock of stocks) {
            const stockCapital = await this.stockCapitalDao.findOne({ where: { stockId: stock.id }, transaction });
            Object.assign(stock, {
                turnoverPer: !stockCapital ? 0 : Calc.formatToPer(stock.totalHand / stockCapital.generalCapital * 100),
                risePer: Calc.formatToPer(stock.change / (stock.currentPrice - stock.change) * 100),
            });
        }
        return stocks as StockFindAllDto[];
    }

    public async update(
        id: string,
        params: StockUpdateDto,
        transaction?: Transaction,
    ) {
        const newTransaction = !transaction;
        transaction = transaction ? transaction : await this.sequelize.transaction();

        try {
            const stock = await this.findOneById(id, transaction);
            if (!stock) throw new NotFoundException();
            const prevPrice = _.clone(stock.currentPrice);

            await this.stockDao.update({
                currentPrice: params.finalPrice,
                change: params.finalPrice - prevPrice,
                totalHand: stock.totalHand + params.finalHand,
                highestPrice: params.finalPrice > stock.highestPrice ? params.finalPrice : undefined,
                lowestPrice: params.finalPrice < stock.lowestPrice ? params.finalPrice : undefined,
            }, {
                    where: {
                        id,
                    },
                    transaction,
                });

            newTransaction && (await transaction.commit());
        } catch (e) {
            newTransaction && (await transaction.rollback());
            throw e;
        }
    }

    public validInTradeTime(dateTime: string = Moment().toISOString()) {
        const tradePeriods = <{ begin: string, end: string }[]>[
            {
                begin: '09:30',
                end: '13:00',
            },
            {
                begin: '13:00',
                end: '09:00',
            },
        ];
        for (const tradePeriod of tradePeriods) {
            if (Moment(tradePeriod.begin, 'HH:mm').unix() <= Moment(dateTime).unix() &&
                Moment(tradePeriod.end, 'HH:mm').unix() >= Moment(dateTime).unix()) {
                return true;
            }
        }
        throw new BadRequestException('当前时间已经休市');
    }

    public async buy(
        id: string,
        price: number,
        hand: number,
        operatorId: string,
        transaction?: Transaction,
    ) {
        await this.validEnoughCapital(operatorId, price, hand, transaction);
        return this.trade(id, price, hand, operatorId, ConstData.TRADE_ACTION.BUY);
    }

    public async sold(
        id: string,
        price: number,
        hand: number,
        operatorId: string,
        transaction?: Transaction,
    ) {
        await this.validEnoughStock(operatorId, id, hand, transaction);
        return this.trade(id, price, hand, operatorId, ConstData.TRADE_ACTION.SOLD);
    }

    public async trade(
        stockId: string,
        price: number,
        hand: number,
        operatorId: string,
        type: ConstData.TRADE_ACTION,
        mode: ConstData.TRADE_MODE = ConstData.TRADE_MODE.LIMIT,
    ) {
        return this.userStockOrderService.create({
            stockId,
            price,
            hand,
            mode,
            userId: operatorId,
            type,
            state: ConstData.ORDER_STATE.READY,
        });
    }

    public async validEnoughCapital(
        userId: string,
        price: number,
        hand: number,
        transaction?: Transaction,
    ) {
        const userCapital = await this.userCapitalService.findOneByUserIdOrThrow(userId, transaction);
        if (Calc.calcStockBuyRemain(userCapital.cash, price, hand) < 0) {
            throw new BadRequestException('资金不足');
        }
    }

    public async validEnoughStock(
        userId: string,
        stockId: string,
        hand: number,
        transaction?: Transaction,
    ) {
        const userStock = await this.userStockService.findOneByUserIdStockIdOrThrow(userId, stockId, transaction);
        if (userStock.amount < hand * 100) {
            throw new BadRequestException('没有足够的股票');
        }
    }

}