import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/entity/sequelize/user.entity';
import { ConstProvider } from 'src/constant/provider.const';
import { Stock } from 'src/entity/sequelize/stock.entity';
import { StockCapital } from 'src/entity/sequelize/stock_capital.entity';
import { StockHistory } from 'src/entity/sequelize/stock_history.entity';
import { StockOrder } from 'src/entity/sequelize/stock_order.entity';
import { UserCapital } from 'src/entity/sequelize/user_capital.entity';
import { UserStock } from 'src/entity/sequelize/user_stock.entity';
import { UserStockOrder } from 'src/entity/sequelize/user_stock_order.entity';

export const databaseProviders = [
    {
        provide: ConstProvider.SEQUELIZE,
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: '19931124',
                database: 'test',
            });
            sequelize.addModels([
                User, Stock, StockCapital, StockHistory, StockOrder,
                UserCapital, UserStock, UserStockOrder,
            ]);
            await sequelize.sync({force:true});
            return sequelize;
        },
    },
];
