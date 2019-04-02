import { Controller, Get, Query, UseGuards, HttpStatus, Patch, Param, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StockOrderService } from '../service/stock_order.service';
import { StockOrder } from '../entity/sequelize/stock_order.entity';
import { StockOrderFindAllSoldShift, StockOrderFindAllBuyShift } from '../vo/stock_order.vo';

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

    @ApiOperation({ title: '获取单个股票的买档' })
    @Get('buy_shifts')
    @ApiResponse({ status: HttpStatus.OK, type: [StockOrderFindAllBuyShift] })
    public async getBuyShifts(
        @Param('stockId') stockId: string,
    ) {
        return this.stockOrderService.findAllBuyShift(stockId);
    }

    @ApiOperation({ title: '获取单个股票的卖档' })
    @Get('sold_shifts')
    @ApiResponse({ status: HttpStatus.OK, type: [StockOrderFindAllSoldShift] })
    public async getSoldShifts(
        @Param('stockId') stockId: string,
    ) {
        return this.stockOrderService.findAllSoldShift(stockId);
    }

}
