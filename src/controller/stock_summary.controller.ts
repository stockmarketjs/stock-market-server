import { Controller, Get, Query, UseGuards, HttpStatus, Patch, Param, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Moment } from '../common/util/moment';
import { StockHistory } from '../entity/sequelize/stock_history.entity';
import { StockSummaryService } from '../service/stock_summary.service';
import { StockSummaryCountVo } from '../vo/stock_summary.vo';

@ApiBearerAuth()
@ApiUseTags('StockSummary')
@Controller('stock_summaries')
export class StockSummaryController {

    constructor(
        private readonly stockSummaryService: StockSummaryService,
    ) { }

    @ApiOperation({ title: '获取整个市场的概况' })
    @Get('market')
    @ApiResponse({ status: HttpStatus.OK, type: [StockSummaryCountVo] })
    public async index(
    ) {
        return this.stockSummaryService.getMarketSummary();
    }

    @ApiOperation({ title: '获取整个市场的排行榜' })
    @Get('rank')
    @ApiResponse({ status: HttpStatus.OK, type: [StockSummaryCountVo] })
    public async getRankSummary(
    ) {
        return this.stockSummaryService.getRankSummary();
    }

}
