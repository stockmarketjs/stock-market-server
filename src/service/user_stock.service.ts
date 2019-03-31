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

    public async findAllByUserId(
        userId: string,
        transaction?: Transaction,
    ) {
        return this.userStockDao.findAll({
            where: {
                userId,
            },
            transaction,
        });
    }

    public async subtractUserStock(
        userId: string,
        stockId: string,
        value: number,
        transaction: Transaction,
    ) {
        return this.operatorUserStock(
            userId,
            stockId,
            -value,
            transaction,
        );
    }

    public async addUserStock(
        userId: string,
        stockId: string,
        value: number,
        transaction: Transaction,
    ) {
        return this.operatorUserStock(
            userId,
            stockId,
            value,
            transaction,
        );
    }

    private async operatorUserStock(
        userId: string,
        stockId: string,
        value: number,
        transaction: Transaction,
    ) {
        const userStock = await this.userStockDao.findOne({
            where: {
                userId,
                stockId,
            },
            transaction,
            lock: Transaction.LOCK.UPDATE,
        });
        if (!userStock) throw new BadRequestException('没有对应的股票账户');
        return this.userStockDao.update({
            amount: userStock.amount + value,
        }, {
                where: { id: userStock.id },
                transaction,
            });
    }

}