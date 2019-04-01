import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { UserDao } from 'src/dao/user.dao';
import { User } from 'src/entity/sequelize/user.entity';
import { Transaction } from 'sequelize/types';

@Injectable()
export class UserService extends BaseService {

    constructor(
        private readonly userDao: UserDao,
    ) {
        super();
    }

    public async findAll(
        transaction?: Transaction,
    ): Promise<User[]> {
        return this.userDao.findAll({ transaction });
    }

}