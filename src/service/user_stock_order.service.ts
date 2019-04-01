import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { Transaction, Op } from 'sequelize';
import * as _ from 'lodash';
import { UserStockOrderDao } from '../dao/user_stock_order.dao';
import { UserStockOrderCreateBodyDto, UserStockOrderUpdateBodyDto } from '../dto/user_stock_order/user_stock_order.dto';
import { ConstData } from '../constant/data.const';

@Injectable()
export class UserStockOrderService extends BaseService {

    constructor(
        private readonly userStockOrderDao: UserStockOrderDao,
    ) {
        super();
    }

    public async create(
        params: UserStockOrderCreateBodyDto,
    ) {
        return this.userStockOrderDao.create(params);
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
    ) {
        return this.userStockOrderDao.findAll({
            where: {
                userId,
            },
            transaction,
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

}