import { Injectable, UnauthorizedException, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { Transaction } from 'sequelize';
import _ from 'lodash';
import { UserCapitalDao } from 'src/dao/user_capital.dao';

@Injectable()
export class UserCapitalService extends BaseService {

    constructor(
        private readonly userCapitalDao: UserCapitalDao,
    ) {
        super();
    }

    public async findOneByUserId(
        userId: string,
        transaction?: Transaction,
    ) {
        return this.userCapitalDao.findOne({ where: { userId }, transaction });
    }

    public async findOneByUserIdOrThrow(
        userId: string,
        transaction?: Transaction,
    ) {
        const userCapital = await this.findOneByUserId(userId, transaction);
        if (!userCapital) throw new NotFoundException();
        return userCapital;
    }

}