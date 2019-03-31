import { IsDefined, IsString, IsInt } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ConstData } from 'src/constant/data.const';

export class StockOrderCreateBodyDto {
    @ApiModelProperty({ description: '股票ID' })
    @IsDefined() @IsString()
    stockId: string;

    @ApiModelProperty({ description: '成交日期' })
    @IsDefined() @IsString()

    date: string;

    @ApiModelProperty({ description: '成交小时分钟' })
    @IsDefined() @IsString()

    minute: string;

    @ApiModelProperty({ description: '成交价' })
    @IsDefined() @IsInt()

    price: number;

    @ApiModelProperty({ description: '成交数' })
    @IsDefined() @IsInt()
    hand: number;
}