import { Controller, Get, Query, UseGuards, HttpStatus, Patch, Param, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserCapitalService } from 'src/service/user_capital.service';
import { UserCapital } from 'src/entity/sequelize/user_capital.entity';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUseTags('User - Capital')
@Controller('users/:userId/capitals')
export class UserCapitalController {

    constructor(
        private readonly userCapitalService: UserCapitalService,
    ) { }

    @ApiOperation({ title: '获取单个员工的资金账户' })
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [UserCapital] })
    public async index(
        @Param('userId') userId: string,
    ) {
        const res = await this.userCapitalService.findOneByUserIdOrThrow(userId);
        return [res];
    }

}
