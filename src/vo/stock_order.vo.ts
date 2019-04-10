import { ApiModelProperty } from '@nestjs/swagger';

export class StockOrderFindAllBuyShift {
    @ApiModelProperty({ description: '档号对应的总手数' })
    readonly hand: number;
    @ApiModelProperty({ description: '档号' })
    readonly shift: number;
    @ApiModelProperty({ description: '档号对应价格' })
    readonly price: number;
}

export class StockOrderFindAllSoldShift {
    @ApiModelProperty({ description: '档号对应的总手数' })
    readonly hand: number;
    @ApiModelProperty({ description: '档号' })
    readonly shift: number;
}

export class StockOrderFindAllVo {
    @ApiModelProperty({ description: '开盘时间' })
    readonly startTime: string;
    @ApiModelProperty({ description: '收盘时间' })
    readonly endTime: string;
    @ApiModelProperty({ description: '分钟和价格的数组', isArray: true, example: '[["12:22",22.11]]' })
    readonly minutePrices: [string, number | null][];
}