import { Injectable } from '@nestjs/common';
import { BaseDao } from './base.dao';
import { StockCapital } from 'src/entity/sequelize/stock_capital.entity';

@Injectable()
export class StockCapitalDao extends BaseDao<StockCapital> {

    protected readonly entity = StockCapital;

}