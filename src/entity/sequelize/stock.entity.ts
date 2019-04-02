import { Table, Column, Model, Unique, DataType } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { ConstData } from '../../constant/data.const';

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
        allowNull: false,
    })
    readonly id: string;

    @ApiModelProperty({ description: '证券所标识', enum: ConstData.STOCK_MARKET })
    @Column({
        type: DataType.STRING(10),
        allowNull: false,
    })
    market: ConstData.STOCK_MARKET;

    @ApiModelProperty({ description: '股票名称' })
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
    })
    name: string;

    @ApiModelProperty({ description: '当前价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
        allowNull: false,
        field: 'current_price',
    })
    currentPrice: number;

    @ApiModelProperty({ description: '换手' })
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    change: number;

    @ApiModelProperty({ description: '总手' })
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        field: 'total_hand',
    })
    totalHand: number;

    @ApiModelProperty({ description: '开盘价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
        allowNull: false,
        field: 'start_price',
    })
    startPrice: number;

    @ApiModelProperty({ description: '收盘价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
        allowNull: false,
        field: 'end_price',
    })
    endPrice: number;

    @ApiModelProperty({ description: '最高价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
        allowNull: false,
        field: 'highest_price',
    })
    highestPrice: number;

    @ApiModelProperty({ description: '最低价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
        allowNull: false,
        field: 'lowest_price',
    })
    lowestPrice: number;

}