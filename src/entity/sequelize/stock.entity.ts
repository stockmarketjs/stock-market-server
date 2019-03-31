import { Table, Column, Model, Unique, DataType } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { ConstData } from 'src/constant/data.const';
import { $ } from 'src/common/util/function';

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['name', 'market'],
        },
    ],
})
export class Stock extends Model<Stock> {
    @ApiModelProperty({ description: 'ID' })
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    readonly id: string;

    @ApiModelProperty({ description: '证券所标识', enum: ConstData.STOCK_MARKET })
    @Column({
        type: DataType.STRING(10),
    })
    market: ConstData.STOCK_MARKET;

    @ApiModelProperty({ description: '股票名称' })
    @Column({
        type: DataType.STRING(16),
    })
    name: string;

    @ApiModelProperty({ description: '当前价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
    })
    currentPrice: number;

    @ApiModelProperty({ description: '换手' })
    @Column({
        type: DataType.BIGINT,
    })
    change: number;

    @ApiModelProperty({ description: '总手' })
    @Column({
        type: DataType.BIGINT,
    })
    totalHand: number;

    @ApiModelProperty({ description: '开盘价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
    })
    startPrice: number;

    @ApiModelProperty({ description: '收盘价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
    })
    endPrice: number;

    @ApiModelProperty({ description: '最高价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
    })
    highestPrice: number;

    @ApiModelProperty({ description: '最低价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
    })
    lowestPrice: number;

}