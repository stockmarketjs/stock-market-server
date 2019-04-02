import { Table, Column, Model, Unique, DataType } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { ConstData } from '../../constant/data.const';

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export class StockOrder extends Model<StockOrder> {
    @ApiModelProperty({ description: 'ID' })
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    readonly id: string;

    @ApiModelProperty({ description: '股票ID' })
    @Column({
        type: DataType.UUID,
        unique: true,
        allowNull: false,
    })
    stockId: string;

    @ApiModelProperty({ description: '成交小时分钟' })
    @Column({
        type: DataType.STRING(5),
        allowNull: false,
    })
    minute: string;

    @ApiModelProperty({ description: '成交日期' })
    @Column({
        type: DataType.STRING(10),
        allowNull: false,
    })
    date: string;

    @ApiModelProperty({ description: '成交价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
        allowNull: false,
    })
    price: number;

    @ApiModelProperty({ description: '成交数' })
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    hand: number;

}