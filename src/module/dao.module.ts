import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/provider/database/database.module';
import { UserDao } from 'src/dao/user.dao';
import { StockDao } from 'src/dao/stock.dao';
import { StockHistoryDao } from 'src/dao/stock_history.dao';
import { StockOrderDao } from 'src/dao/stock_order.dao';
import { UserCapitalDao } from 'src/dao/user_capital.dao';
import { UserStockDao } from 'src/dao/user_stock.dao';
import { StockCapitalDao } from 'src/dao/stock_capital.dao';
import { UserStockOrderDao } from 'src/dao/user_stock_order.dao';

@Module({
    imports: [DatabaseModule],
    providers: [
        UserDao, StockDao, StockHistoryDao, StockOrderDao, UserCapitalDao, UserStockDao,
        StockCapitalDao, UserStockOrderDao,
    ],
    exports: [
        UserDao, StockDao, StockHistoryDao, StockOrderDao, UserCapitalDao, UserStockDao,
        StockCapitalDao, UserStockOrderDao,
    ],
})
export class DaoModule { }
