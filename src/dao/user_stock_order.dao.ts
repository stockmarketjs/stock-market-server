import { Injectable } from '@nestjs/common';
import { BaseDao } from './base.dao';
import { UserStockOrder } from 'src/entity/sequelize/user_stock_order.entity';

@Injectable()
export class UserStockOderDao extends BaseDao<UserStockOrder> {

    protected readonly entity = UserStockOrder;

}