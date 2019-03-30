import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { AuthLoginQueryDto, AuthLoginResultDto, AuthUser } from 'src/dto/auth/auth.dto';
import { UserDao } from 'src/dao/user.dao';
import { JwtService } from '@nestjs/jwt';

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
    ): Promise<AuthLoginResultDto> {
        const user = await this.userDao.findOneScopeAll({
            where: {
                account: params.account,
                password: params.password,
            },
        });
        if (!user) throw new UnauthorizedException();
        const token = await this.signInToken({ id: user.id });
        return {
            token,
        };
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