import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException, forwardRef } from '@nestjs/common';
import { BaseService } from './base.service';
import { Transaction, Op } from 'sequelize';
import * as _ from 'lodash';
import { UserStockOrderDao } from '../dao/user_stock_order.dao';
import { UserStockOrderCreateBodyDto, UserStockOrderUpdateBodyDto } from '../dto/user_stock_order/user_stock_order.dto';
import { ConstData } from '../constant/data.const';
import { StockDao } from '../dao/stock.dao';
import { UserStockOrderFindAllVo } from '../vo/user_stock_order.vo';
import { ConstProvider } from '../constant/provider.const';
import { Sequelize } from 'sequelize-typescript';
import { StockService } from './stock.service';
import { UserCapitalService } from './user_capital.service';
import { UserStockService } from './user_stock.service';
import { UserStockOrder } from '../entity/sequelize/user_stock_order.entity';

@Injectable()
export class UserStockOrderService extends BaseService {

    constructor(
        @Inject(ConstProvider.SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly userStockOrderDao: UserStockOrderDao,
        private readonly stockDao: StockDao,
        @Inject(forwardRef(() => StockService))
        private readonly stockService: StockService,
        private readonly userCapitalService: UserCapitalService,
        private readonly userStockService: UserStockService,
    ) {
        super();
    }

    public async create(
        params: UserStockOrderCreateBodyDto,
        transaction?: Transaction,
    ) {
        Object.assign(params, {
            tradeHand: params.hand,
        });
        return this.userStockOrderDao.create(params, { transaction });
    }

    public async findAllByUserId(
        userId: string,
        transaction?: Transaction,
    ): Promise<UserStockOrderFindAllVo[]> {
        const userStockOrders = await this.userStockOrderDao.findAll({
            where: {
                userId,
            },
            order: [['updatedAt', 'DESC']],
            transaction,
        });
        const stocks = await this.stockDao.findAll({
            where: {
                id: {
                    [Op.in]: _.map(userStockOrders, 'stockId'),
                },
            },
        });
        return userStockOrders.map(userStockOrder => {
            const stock = _.find(stocks, { id: userStockOrder.stockId });
            userStockOrder.setDataValue<any>('stock', stock);
            return userStockOrder;
        });
    }

    public async cancelById(
        id: string,
        transaction?: Transaction,
    ) {
        this.stockService.validInTradeTime();
        const newTransaction = !transaction;
        transaction = transaction ? transaction : await this.sequelize.transaction();

        try {
            const userStockOrder = await this.userStockOrderDao.findOne({
                where: {
                    id,
                },
                lock: Transaction.LOCK.UPDATE,
                transaction,
            });
            if (!userStockOrder || userStockOrder.state !== ConstData.ORDER_STATE.READY)
                throw new BadRequestException('撤回失败');
            await this.userStockOrderDao.update({
                state: ConstData.ORDER_STATE.CANCEL,
            }, {
                    where: {
                        id,
                        state: ConstData.ORDER_STATE.READY,
                    },
                    transaction,
                });
            await this.cancelFrozen(
                userStockOrder,
                userStockOrder.userId,
                userStockOrder.hand * 100,
                userStockOrder.stockId,
                transaction,
            );

            newTransaction && await transaction.commit();
            return true;
        } catch (e) {
            newTransaction && await transaction.rollback();
            throw e;
        }
    }

    private async cancelFrozen(
        userStockOrder: UserStockOrder,
        userId: string,
        value: number,
        stockId: string,
        transaction: Transaction,
    ) {
        if (userStockOrder.type === ConstData.TRADE_ACTION.BUY) {
            await this.userCapitalService.findOneByPkLock(userId, transaction);
            await this.userCapitalService.unfrozenUserCapitalWhenCost(
                userId,
                value,
                transaction,
            );
        }
        if (userStockOrder.type === ConstData.TRADE_ACTION.SOLD) {
            await this.userStockService.findOneByPkLock(userId, stockId, transaction);
            await this.userStockService.unfrozenUserStockWhenCost(
                userId,
                stockId,
                value,
                transaction,
            );
        }
    }

}