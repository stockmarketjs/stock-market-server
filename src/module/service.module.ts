import { Module } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { DaoModule } from './dao.module';
import { JwtStrategy } from 'src/common/passport/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { StockService } from 'src/service/stock.service';
import { UserCapitalService } from 'src/service/user_capital.service';
import { UserStockService } from 'src/service/user_stock.service';
import { StockHistoryService } from 'src/service/stock_history.service';
import { StockOrderService } from 'src/service/stock_order.service';

@Module({
    imports: [
        DaoModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: 'hui8sdYDGSYGD87td87gYusgduyasg6TS^D&dyggdsuadg23137&^^$2h',
            signOptions: {
                expiresIn: '2d',
            },
        }),
    ],
    providers: [
        AuthService, JwtStrategy,
        StockService, UserCapitalService, UserStockService, StockHistoryService,
        StockOrderService,
    ],
    exports: [
        AuthService, PassportModule,
        StockService, UserCapitalService, UserStockService, StockHistoryService,
        StockOrderService,
    ],
})
export class ServiceModule { }
