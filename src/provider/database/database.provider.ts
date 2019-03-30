import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/entity/sequelize/user.entity';
import { ConstProvider } from 'src/constant/provider.const';
import { Stock } from 'src/entity/sequelize/stock.entity';
import { StockCapital } from 'src/entity/sequelize/stock_capital.entity';

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
            sequelize.addModels([User, Stock, StockCapital]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
