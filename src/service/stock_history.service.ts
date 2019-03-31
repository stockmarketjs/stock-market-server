import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { Transaction, Op } from 'sequelize';
import * as _ from 'lodash';
import { StockHistoryDao } from 'src/dao/stock_history.dao';
import { Moment } from 'src/common/util/moment';

@Injectable()
export class StockHistoryService extends BaseService {

    constructor(
        private readonly stockHistoryDao: StockHistoryDao,
    ) {
        super();
    }

    public async findAllByPeriod(stockId: string, begin?: string, end?: string) {
        return this.stockHistoryDao.findAll({
            where: {
                stockId,
                date: {
                    [Op.lte]: Moment(end).format('YYYY-MM-DD'),
                    [Op.gte]: Moment(begin).format('YYYY-MM-DD'),
                },
            },
            order: [['date', 'ASC']],
        });
    }

}
