import { Controller, Get, Query, UseGuards, HttpStatus, Patch, Param, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StockHistoryService } from '../service/stock_history.service';
import { Moment } from '../common/util/moment';
import { StockHistory } from '../entity/sequelize/stock_history.entity';

@ApiBearerAuth()
@ApiUseTags('Stock - History')
@Controller('stocks/:stockId/histories')
export class StockHistoryController {

    constructor(
        private readonly stockHistoryService: StockHistoryService,
    ) { }

    @ApiOperation({ title: '获取单个股票的历史走势' })
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [StockHistory] })
    public async index(
        @Param('stockId') stockId: string,
    ) {
        return this.stockHistoryService.findAllByPeriod(
            stockId,
            Moment().subtract(4, 'months').format('YYYY-MM-DD'),
            Moment().subtract(1,'days').format('YYYY-MM-DD'),
        );
    }

}
