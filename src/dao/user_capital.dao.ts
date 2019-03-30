import { Injectable } from '@nestjs/common';
import { BaseDao } from './base.dao';
import { UserCapital } from 'src/entity/sequelize/user_capital.entity';

@Injectable()
export class UserCapitalDao extends BaseDao<UserCapital> {

    protected readonly entity = UserCapital;

}