import { Controller, Get, Query, UseGuards, HttpStatus, Patch, Param, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Operator } from 'src/decorator/operator.decorator';
import { StockService } from 'src/service/stock.service';
import { StockFindAllDto, StockBuyDto, StockSoldDto } from 'src/dto/stock/stock.dto';
import { AuthUser } from 'src/dto/auth/auth.dto';
import { Stock } from 'src/entity/sequelize/stock.entity';

@ApiBearerAuth()
@ApiUseTags('Stock')
@Controller('stocks')
export class StockController {

    constructor(
        private readonly stockService: StockService,
    ) { }

    @ApiOperation({ title: '获取全部股票' })
    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: [StockFindAllDto] })
    public async index() {
        return this.stockService.findAll();
    }

    @ApiOperation({ title: '获取单个股票' })
    @ApiResponse({ status: HttpStatus.OK, type: Stock })
    @Get(':id')
    public async show(
        @Param('id') id: string,
    ) {
        return this.stockService.findOneByIdOrThrow(id);
    }

    @UseGuards(AuthGuard())
    @ApiOperation({ title: '买进股票' })
    @ApiResponse({ status: HttpStatus.OK })
    @Post(':id/buy')
    public async buy(
        @Param('id') id: string,
        @Body() body: StockBuyDto,
        @Operator() operator: AuthUser,
    ) {
        this.stockService.validInTradeTime();
        await this.stockService.buy(id, body.price, body.hand, operator.id);
        return true;
    }

    @UseGuards(AuthGuard())
    @ApiOperation({ title: '卖出股票' })
    @ApiResponse({ status: HttpStatus.OK })
    @Post(':id/sold')
    public async sold(
        @Param('id') id: string,
        @Body() body: StockSoldDto,
        @Operator() operator: AuthUser,
    ) {
        this.stockService.validInTradeTime();
        await this.stockService.sold(id, body.price, body.hand, operator.id);
        return true;
    }

}
