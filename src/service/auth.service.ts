import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from './base.service';
import { AuthLoginQueryDto, AuthUser, AuthRegisterBodyDto } from 'src/dto/auth/auth.dto';
import { UserDao } from 'src/dao/user.dao';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterVo, AuthLoginVo } from 'src/vo/auth.vo';
import { Encrypt } from 'src/common/encrypt/encrypt';
import { $ } from 'src/common/util/function';
import { Transaction } from 'sequelize/types';

@Injectable()
export class AuthService extends BaseService {

    constructor(
        private readonly userDao: UserDao,
        private readonly jwtService: JwtService,
    ) {
        super();
    }

    public async login(
        params: AuthLoginQueryDto,
    ): Promise<AuthLoginVo> {
        const user = await this.userDao.findOneScopeAll({
            where: {
                account: params.account,
            },
        });
        if (!user) throw new UnauthorizedException();
        if (user.password !== Encrypt.make([params.password, user.id])) throw new UnauthorizedException();
        const token = await this.signInToken({ id: user.id });
        return {
            token,
        };
    }

    public async validRegister(
        params: AuthRegisterBodyDto,
        transaction?: Transaction,
    ) {
        const countOfUsers = await this.userDao.count({
            where: {
                account: params.account,
            },
            transaction,
        });
        if (countOfUsers > 0) throw new BadRequestException('账号已存在');
    }

    public async register(
        params: AuthRegisterBodyDto,
        transaction?: Transaction,
    ): Promise<AuthRegisterVo> {
        await this.validRegister(params);
        const id = $.getUuid();
        const user = await this.userDao.create({
            id,
            account: params.account,
            password: Encrypt.make([params.password, id]),
        }, { transaction });
        return { account: user.account, id: user.id };
    }

    public async findOneById(id: string) {
        return this.userDao.findOne({ where: { id } });
    }

    public async findOneByIdOrThrow(id: string) {
        const user = await this.findOneById(id);
        if (!user) throw new NotFoundException();
        return user;
    }

    private async signInToken(data: AuthUser): Promise<string> {
        return `Bearer ${this.jwtService.sign(data)}`;
    }

}