import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, Logger, Inject } from '@nestjs/common';
import { BaseService } from './base.service';
import { OrderService } from './order.service';
import { UserCapitalService } from './user_capital.service';
import { CronJob } from 'cron';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { Sequelize } from 'sequelize-typescript';
import { ConstProvider } from '../constant/provider.const';
import { $ } from '../common/util/function';
import { StockHistoryService } from './stock_history.service';
import { StockService } from './stock.service';
import { Moment } from '../common/util/moment';
import { ConstData } from '../constant/data.const';

@Injectable()
export class CronService extends BaseService {

    constructor(
        @Inject(ConstProvider.SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly orderService: OrderService,
        private readonly authService: AuthService,
        private readonly userCapitalService: UserCapitalService,
        private readonly userService: UserService,
        private readonly stockHistoryService: StockHistoryService,
        private readonly stockService: StockService,
    ) {
        super();
    }

    public async fire() {
        await this.fireHandle();
        await this.fireCreateRobot();
        await this.fireGrantCapital();
        await this.fireEndQuotation();
        await this.fireStartQuotation();
    }

    private async fireStartQuotation() {
        const begin = Moment(ConstData.TRADE_PERIODS[0].begin, 'HH:mm').subtract(1, 'hours');
        const minutes = Moment(begin).format('mm');
        const hours = Moment(begin).format('HH');
        const job = new CronJob(`00 ${minutes} ${hours} * * *`, async () => {
            Logger.log('开盘开始');
            const transaction = await this.sequelize.transaction();
            try {
                const stocks = await this.stockService.findAll(transaction);
                for (const stock of stocks) {
                    await this.stockService.startQuotation(stock.id, transaction);
                }
                await transaction.commit();
            } catch (e) {
                console.log(e);
                await transaction.rollback();
            }
            Logger.log('开盘结束');
        });
        job.start();
    }

    private async fireEndQuotation() {
        const currentDate = Moment().format('YYYY-MM-DD');
        const end = Moment(ConstData.TRADE_PERIODS[1].end, 'HH:mm').add(30, 'minutes');
        const minutes = Moment(end).format('mm');
        const hours = Moment(end).format('HH');
        const job = new CronJob(`00 ${minutes} ${hours} * * *`, async () => {
            Logger.log('收盘开始');
            const transaction = await this.sequelize.transaction();
            try {
                const stocks = await this.stockService.findAll(transaction);
                for (const stock of stocks) {
                    await this.stockService.endQuotation(stock.id, transaction);
                    await this.stockHistoryService.create({
                        stockId: stock.id,
                        date: currentDate,
                        market: stock.market,
                        name: stock.name,
                        currentPrice: stock.currentPrice,
                        change: stock.change,
                        totalHand: stock.totalHand,
                        startPrice: stock.startPrice,
                        endPrice: stock.endPrice,
                        highestPrice: stock.highestPrice,
                        lowestPrice: stock.lowestPrice,
                    }, transaction);
                }
                await transaction.commit();
            } catch (e) {
                console.log(e);
                await transaction.rollback();
            }
            Logger.log('收盘结束');
        });
        job.start();
    }

    private async fireGrantCapital() {
        // 0 0 1 * * *
        const createRobotJob = new CronJob('54 */30 * * * *', async () => {
            Logger.log('发钱开始');
            const transaction = await this.sequelize.transaction();
            try {
                const users = await this.userService.findAll(transaction);
                for (const user of users) {
                    const userCapital = await this.userCapitalService.findOneByUserId(user.id, transaction);
                    if (userCapital) await this.userCapitalService.addUserCapital(user.id, 1000, transaction);
                }
                await transaction.commit();
            } catch (e) {
                console.log(e);
                await transaction.rollback();
            }
            Logger.log('发钱结束');
        });
        createRobotJob.start();
    }

    private async fireCreateRobot() {
        // 0 */20 * * * *
        const createRobotJob = new CronJob('35 */20 * * * *', async () => {
            Logger.log('创建机器人开始');
            const transaction = await this.sequelize.transaction();
            try {
                const user = await this.authService.register({
                    account: `robot_${$.getUuid()}`,
                    password: $.getUuid(),
                }, transaction);
                await this.userCapitalService.create(user.id, transaction);
                await transaction.commit();
            } catch (e) {
                console.log(e);
                await transaction.rollback();
            }
            Logger.log('创建机器人结束');
        });
        createRobotJob.start();
    }

    private async fireHandle() {
        const handleJob = new CronJob('10 * * * * *', async () => {
            Logger.log('核算开始');
            await this.orderService.handle();
            Logger.log('核算结束');
        });
        handleJob.start();
    }

}