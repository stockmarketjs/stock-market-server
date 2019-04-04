import { Controller, Get, Query, UseGuards, HttpStatus, Patch, Param, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserStockOrderService } from '../service/user_stock_order.service';
import { UserStockOrder } from '../entity/sequelize/user_stock_order.entity';
import { UserStockOrderFindAllVo } from '../vo/user_stock_order.vo';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUseTags('User - StockOrder')
@Controller('users/:userId/stock_orders')
export class UserStockOrderController {

    constructor(
        private readonly userStockOrderService: UserStockOrderService,
    ) { }

    @ApiOperation({ title: '获取单个员工的股票订单' })
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [UserStockOrderFindAllVo] })
    public async index(
        @Param('userId') userId: string,
    ) {
        return this.userStockOrderService.findAllByUserId(userId);
    }

}
