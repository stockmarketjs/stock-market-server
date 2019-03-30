import { Injectable } from '@nestjs/common';
import { BaseDao } from './base.dao';
import { User } from 'src/entity/sequelize/user.entity';
import { FindOptions } from 'sequelize';

@Injectable()
export class UserDao extends BaseDao<User> {

    protected readonly entity = User;

    public async findOneScopeAll(option: FindOptions) {
        return this.sequelize.getRepository(this.entity).scope('all').findOne(option);
    }

}