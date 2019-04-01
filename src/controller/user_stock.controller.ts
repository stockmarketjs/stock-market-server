import { Controller, Get, Query, UseGuards, HttpStatus, Patch, Param, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserStockService } from '../service/user_stock.service';
import { UserStock } from '../entity/sequelize/user_stock.entity';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUseTags('User - Stock')
@Controller('users/:userId/stocks')
export class UserStockController {

    constructor(
        private readonly userStockService: UserStockService,
    ) { }

    @ApiOperation({ title: '获取单个员工的所持有股票们' })
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [UserStock] })
    public async index(
        @Param('userId') userId: string,
    ) {
        return this.userStockService.findAllByUserId(userId);
    }

}
