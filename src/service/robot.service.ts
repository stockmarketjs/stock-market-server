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
import * as _ from 'lodash';
import { Transaction } from 'sequelize/types';

@Injectable()
export class RobotService extends BaseService {

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

    private async randomStrategy(
        operatorId: string,
        transaction?: Transaction,
    ) {
        if (await this.random()) {
            await this.buyRandomStock(operatorId, transaction);
        }
        if (await this.random()) {
            await this.soldRandomStock(operatorId, transaction);
        }
    }

    private async random(): Promise<boolean> {
        if (_.random(0, 5) !== 2) return false;
        return true;
    }

    private async buyRandomStock(
        operatorId: string,
        transaction?: Transaction,
    ) {
        const stocks = await this.stockService.findAll(transaction);
        const stock = _.shuffle(stocks).pop();
        if (!stock) return false;

        const hand = _.random(1, 100);
        await this.stockService.buy(stock.id, stock.currentPrice, hand, operatorId, transaction);
    }

    private async soldRandomStock(
        operatorId: string,
        transaction?: Transaction,
    ) {
        const stocks = await this.stockService.findAll(transaction);
        const stock = _.shuffle(stocks).pop();
        if (!stock) return false;

        const hand = _.random(1, 100);
        await this.stockService.sold(stock.id, stock.currentPrice, hand, operatorId, transaction);
    }

    public async dispatchStrategy() {
        const transaction = await this.sequelize.transaction();
        try {
            const robots = await this.userService.findAllRobot(transaction);
            for (const robot of robots) {
                try {
                    await this.randomStrategy(robot.id, transaction);
                } catch{ }
            }
            await transaction.commit();
        } catch (e) {
            console.log(e);
            await transaction.rollback();
        }
    }

}