import { Module } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { DaoModule } from './dao.module';
import { JwtStrategy } from 'src/common/passport/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

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
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, PassportModule],
})
export class ServiceModule { }
