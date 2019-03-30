import { Table, Column, Model, Unique, DataType } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';

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
    })
    readonly id: string;

    @ApiModelProperty({ description: '股票ID' })
    @Column({
        type: DataType.UUID,
        unique: true,
    })
    stockId: string;

    @ApiModelProperty({ description: '成交小时分钟' })
    @Column({
        type: DataType.STRING(5),
    })
    minute: string;

    @ApiModelProperty({ description: '具体成交时间' })
    @Column({
        type: DataType.STRING(30),
    })
    time: string;

    @ApiModelProperty({ description: '成交价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
    })
    price: number;

}