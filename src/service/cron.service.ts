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

@Injectable()
export class CronService extends BaseService {

    constructor(
        @Inject(ConstProvider.SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly orderService: OrderService,
        private readonly authService: AuthService,
        private readonly userCapitalService: UserCapitalService,
        private readonly userService: UserService,
    ) {
        super();
    }

    public async fire() {
        await this.fireHandle();
        await this.fireCreateRobot();
        await this.fireGrantCapital();
    }

    private async fireGrantCapital() {
        // 0 0 1 * * *
        const createRobotJob = new CronJob('54 * * * * *', async () => {
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
        const createRobotJob = new CronJob('35 * * * * *', async () => {
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
        const handleJob = new CronJob('11 * * * * *', async () => {
            Logger.log('核算开始');
            await this.orderService.handle();
            Logger.log('核算结束');
        });
        handleJob.start();
    }

}