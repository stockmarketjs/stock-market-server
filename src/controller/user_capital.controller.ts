import { Controller, Get, Query, UseGuards, HttpStatus, Patch, Param, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserCapitalService } from '../service/user_capital.service';
import { UserCapital } from '../entity/sequelize/user_capital.entity';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUseTags('User - Capital')
@Controller('users/:userId/capitals')
export class UserCapitalController {

    constructor(
        private readonly userCapitalService: UserCapitalService,
    ) { }

    @ApiOperation({ title: '获取单个用户的资金账户', description: '现在只有人民币账户一种' })
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [UserCapital] })
    public async index(
        @Param('userId') userId: string,
    ) {
        const res = await this.userCapitalService.findOneByUserId(userId);
        return res ? [res] : [];
    }

    @ApiOperation({ title: '单个用户的开户' })
    @Post()
    @ApiResponse({ status: HttpStatus.OK, type: UserCapital })
    public async store(
        @Param('userId') userId: string,
    ) {
        return this.userCapitalService.create(userId);
    }

}
