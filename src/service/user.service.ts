import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { Transaction } from 'sequelize/types';
import { UserDao } from '../dao/user.dao';
import { User } from '../entity/sequelize/user.entity';

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