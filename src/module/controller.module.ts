import { Module } from '@nestjs/common';
import { ServiceModule } from './service.module';
import { AuthController } from '../controller/auth.controller';
import { StockController } from '../controller/stock.controller';
import { StockHistoryController } from '../controller/stock_history.controller';
import { UserStockController } from '../controller/user_stock.controller';
import { UserCapitalController } from '../controller/user_capital.controller';
import { UserStockOrderController } from '../controller/user_stock_order.controller';
import { StockOrderController } from '../controller/stock_order.controller';
import { StockSummaryController } from '../controller/stock_summary.controller';

@Module({
    imports: [ServiceModule],
    controllers: [
        AuthController, StockController, StockHistoryController,
        StockOrderController, UserCapitalController, UserStockController,
        UserStockOrderController, StockSummaryController,
    ],
})
export class ControllerModule { }
