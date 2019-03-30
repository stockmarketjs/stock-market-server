import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { Transaction, Op } from 'sequelize';
import _ from 'lodash';
import { StockOrderDao } from 'src/dao/stock_order.dao';
import { Moment } from 'src/common/util/moment';
import { $ } from 'src/common/util/function';
import { StockOrder } from 'src/entity/sequelize/stock_order.entity';

@Injectable()
export class StockOrderService extends BaseService {

    constructor(
        private readonly stockOrderDao: StockOrderDao,
    ) {
        super();
    }

    public async findAllOfDate(
        stockId: string,
        date: string = Moment().format('YYYY-MM-DD'),
    ) {
        const models = await this.stockOrderDao.findAll({
            where: {
                stockId,
                date,
            },
            order: [['createdAt', 'ASC']],
        });
        // 将所有数组, 分组成 分钟单位
        const group = _.groupBy(models, 'minute');
        // 历史数据的每分钟, 以那一分钟最后一笔交易为准
        const data: StockOrder[] = [];
        for (const minute in group) {
            const item = $.tail(group[minute]);
            data.push(item);
        }

        /**
         * 获取允许交易的时间
         */
        const periods = <{ begin: string, end: string }[]>[
            {
                begin: '09:30',
                end: '13:00',
            },
            {
                begin: '13:00',
                end: '09:00',
            },
        ];
        // 格式化交易时间段
        const tradePeriods = _.map(periods, tradePeriod => {
            const endMarket = Moment(tradePeriod.end, 'HH:mm');
            if (Moment().format('HHmm') >= endMarket.format('HHmm')) {
                return {
                    begin: Moment(tradePeriod.begin, 'HH:mm').toISOString(),
                    end: endMarket.seconds(0).milliseconds(0).toISOString(),
                };
            } else {
                return {
                    begin: Moment(tradePeriod.begin, 'HH:mm').toISOString(),
                    end: Moment().toISOString(),
                };
            }
        });
        const minutes = this.generateEmptyPeriods(tradePeriods);

        const res: StockOrder[] = [];
        for (const minute of minutes) {
            const item = _.find(data, { minute });
            if (item) {
                res.push(item);
            } else {
                res.push(new StockOrder({
                    minute,
                    hand: 0,
                    price: $.tail(res) ? $.tail(res).price : 0,
                }));
            }
        }

        return res;
    }

    public generateEmptyPeriods(periods: { begin: string, end: string }[]) {
        let res: string[] = [];

        for (const period of periods) {
            res = _.union(res, this.generateEmptyPeriod(period.begin, period.end));
        }

        return res;
    }

    public generateEmptyPeriod(begin: string, end: string) {
        const res: string[] = [];
        const beginObj = Moment(begin);
        const endObj = Moment(end);

        // 初始化, 先放第一个
        const init_minute = beginObj.format('HH:mm');
        res.push(init_minute);

        // 累加1分钟
        while (beginObj.unix() < endObj.unix()) {
            beginObj.add(1, 'minutes');
            res.push(beginObj.format('HH:mm'));
        }

        return res.sort();
    }

}
