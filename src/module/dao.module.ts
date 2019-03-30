import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/provider/database/database.module';
import { UserDao } from 'src/dao/user.dao';

@Module({
    imports: [DatabaseModule],
    providers: [UserDao],
    exports: [UserDao],
})
export class DaoModule { }
