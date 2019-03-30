import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { Transaction } from 'sequelize';
import _ from 'lodash';
import { UserStockDao } from 'src/dao/user_stock.dao';

@Injectable()
export class UserStockService extends BaseService {

    constructor(
        private readonly userStockDao: UserStockDao,
    ) {
        super();
    }

    public async findOneByUserIdStockId(
        stockId: string,
        userId: string,
        transaction?: Transaction,
    ) {
        return this.userStockDao.findOne({ where: { userId, stockId }, transaction });
    }

    public async findOneByUserIdStockIdOrThrow(
        stockId: string,
        userId: string,
        transaction?: Transaction,
    ) {
        const userStock = await this.findOneByUserIdStockId(stockId, userId, transaction);
        if (!userStock) throw new NotFoundException();
        return userStock;
    }

}