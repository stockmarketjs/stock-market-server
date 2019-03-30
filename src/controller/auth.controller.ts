import { Controller, Get, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { AuthLoginQueryDto, AuthLoginResultDto, AuthUser } from 'src/dto/auth/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/entity/sequelize/user.entity';
import { Operator } from 'src/decorator/operator.decorator';

@ApiBearerAuth()
@ApiUseTags('授权模块')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @ApiOperation({ title: '登录' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthLoginResultDto })
    @Get('login')
    public async getLogin(
        @Query() query: AuthLoginQueryDto,
    ): Promise<AuthLoginResultDto> {
        return this.authService.login(query);
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
