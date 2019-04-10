import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { Transaction, Op } from 'sequelize';
import * as _ from 'lodash';
import { StockHistoryDao } from '../dao/stock_history.dao';
import { Moment } from '../common/util/moment';
import { StockHistoryCreateBodyDto } from '../dto/stock/stock_history.dto';

@Injectable()
export class StockHistoryService extends BaseService {

    constructor(
        private readonly stockHistoryDao: StockHistoryDao,
    ) {
        super();
    }

    public async create(
        paarms: StockHistoryCreateBodyDto,
        transaction?: Transaction,
    ) {
        return this.stockHistoryDao.create(paarms, { transaction });
    }

    public async findAllByPeriod(stockId: string, begin: string, end: string) {
        const stockHistories = await this.stockHistoryDao.findAll({
            where: {
                stockId,
                date: {
                    [Op.lte]: Moment(end).format('YYYY-MM-DD'),
                    [Op.gte]: Moment(begin).format('YYYY-MM-DD'),
                },
            },
            order: [['date', 'ASC']],
        });

        const dates: {
            date: string,
            startPrice: number | null,
            endPrice: number | null,
            lowestPrice: number | null,
            highestPrice: number | null,
        }[] = this.generateEmptyPeriod(begin, end).map(v => {
            return {
                date: v,
                startPrice: null,
                endPrice: null,
                lowestPrice: null,
                highestPrice: null,
            };
        });
        const res = _.unionBy(stockHistories.map(v => {
            return {
                date: v.date,
                startPrice: v.startPrice,
                endPrice: v.endPrice,
                lowestPrice: v.lowestPrice,
                highestPrice: v.highestPrice,
            };
        }), dates, 'date');
        return _.orderBy(res, ['date'], ['asc']);
    }

    private generateEmptyPeriod(begin: string, end: string) {
        const res: string[] = [];
        const beginObj = Moment(begin);
        const endObj = Moment(end);

        // 初始化, 先放第一个
        const initDate = beginObj.format('YYYY-MM-DD');
        res.push(initDate);

        // 累加1
        while (beginObj.unix() < endObj.unix()) {
            beginObj.add(1, 'days');
            res.push(beginObj.format('YYYY-MM-DD'));
        }

        return res.sort();
    }

}
