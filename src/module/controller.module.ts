import { Module } from '@nestjs/common';
import { AuthController } from 'src/controller/auth.controller';
import { ServiceModule } from './service.module';
import { StockController } from 'src/controller/stock.controller';
import { StockHistoryController } from 'src/controller/stock_history.controller';
import { StockOrderController } from 'src/controller/stock_order.controller';

@Module({
    imports: [ServiceModule],
    controllers: [
        AuthController, StockController, StockHistoryController,
        StockOrderController,
    ],
})
export class ControllerModule { }
