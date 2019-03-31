import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { Transaction } from 'sequelize';
import _ from 'lodash';
import { UserStockOrderDao } from 'src/dao/user_stock_order.dao';
import { UserStockOrderCreateBodyDto } from 'src/dto/user_stock_order/user_stock_order.dto';
import { ConstData } from 'src/constant/data.const';

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

}