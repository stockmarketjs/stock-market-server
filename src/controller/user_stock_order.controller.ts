import { Controller, Get, Query, UseGuards, HttpStatus, Patch, Param, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserStockOrderService } from 'src/service/user_stock_order.service';
import { UserStockOrder } from 'src/entity/sequelize/user_stock_order.entity';

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
    @ApiResponse({ status: HttpStatus.OK, type: [UserStockOrder] })
    public async index(
        @Param('userId') userId: string,
    ) {
        return this.userStockOrderService.findAllByUserId(userId);
    }

}
