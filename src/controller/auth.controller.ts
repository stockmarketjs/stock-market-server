import { Controller, Get, Query, UseGuards, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthLoginQueryDto, AuthUser, AuthLoginBodyDto, AuthRegisterBodyDto } from '../dto/auth/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../entity/sequelize/user.entity';
import { Operator } from '../decorator/operator.decorator';
import { AuthLoginVo, AuthRegisterVo } from '../vo/auth.vo';

@ApiBearerAuth()
@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @ApiOperation({ title: '登录' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthLoginVo })
    @Get('login')
    public async getLogin(
        @Query() query: AuthLoginQueryDto,
    ): Promise<AuthLoginVo> {
        return this.authService.login(query);
    }

    @ApiOperation({ title: '登录' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthLoginVo })
    @Post('login')
    public async postLogin(
        @Body() body: AuthLoginBodyDto,
    ): Promise<AuthLoginVo> {
        return this.authService.login(body);
    }

    @ApiOperation({ title: '注册' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthRegisterVo })
    @Post('register')
    public async postRegister(
        @Body() body: AuthRegisterBodyDto,
    ): Promise<AuthRegisterVo> {
        return this.authService.register(body);
    }

    @UseGuards(AuthGuard())
    @ApiOperation({ title: '获取个人信息' })
    @ApiResponse({ status: HttpStatus.OK, type: User })
    @Get('user')
    public async getUser(
        @Operator() operator: AuthUser,
    ): Promise<User> {
        return this.authService.findOneByIdOrThrow(operator.id);
    }

}
