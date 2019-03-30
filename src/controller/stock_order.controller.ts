import { Controller, Get, Query, UseGuards, HttpStatus, Patch, Param, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StockOrderService } from 'src/service/stock_order.service';
import { StockOrder } from 'src/entity/sequelize/stock_order.entity';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUseTags('Stock - Order')
@Controller('stocks/:stockId/orders')
export class StockOrderController {

    constructor(
        private readonly stockOrderService: StockOrderService,
    ) { }

    @ApiOperation({ title: '获取单个股票的实时走势' })
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [StockOrder] })
    public async index(
        @Param('stockId') stockId: string,
    ) {
        return this.stockOrderService.findAllOfDate(stockId);
    }

}
