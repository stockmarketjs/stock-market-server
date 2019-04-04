import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class UserStockOrderService extends BaseService {

    constructor(
        @Inject(ConstProvider.SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly userStockOrderDao: UserStockOrderDao,
        private readonly stockDao: StockDao,
    ) {
        super();
    }

    public async create(
        params: UserStockOrderCreateBodyDto,
        transaction?: Transaction,
    ) {
        return this.userStockOrderDao.create(params, { transaction });
    }

    public async findAllReadyByStockIdWithLock(
        stockId: string,
        transaction: Transaction,
    ) {
        return this.userStockOrderDao.findAll({
            where: {
                stockId,
                state: ConstData.ORDER_STATE.READY,
            },
            transaction,
            lock: Transaction.LOCK.UPDATE,
        });
    }

    public async findAllByUserId(
        userId: string,
        transaction?: Transaction,
    ): Promise<UserStockOrderFindAllVo[]> {
        const userStockOrders = await this.userStockOrderDao.findAll({
            where: {
                userId,
            },
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

    public async updateById(
        id: string,
        params: UserStockOrderUpdateBodyDto,
        transaction?: Transaction,
    ) {
        return this.userStockOrderDao.update({
            state: params.state,
        }, {
                where: {
                    id,
                },
                transaction,
            });
    }

    public async bulkUpdateByIds(
        ids: string[],
        params: UserStockOrderUpdateBodyDto,
        transaction?: Transaction,
    ) {
        return this.userStockOrderDao.bulkUpdate({
            state: params.state,
        }, {
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
                transaction,
            });
    }

    public async cancelById(
        id: string,
        transaction?: Transaction,
    ) {
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

            newTransaction && await transaction.commit();
            return true;
        } catch (e) {
            newTransaction && await transaction.rollback();
            throw e;
        }
    }

}