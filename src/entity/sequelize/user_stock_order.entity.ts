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
            unique: false,
            fields: ['stock_id', 'state'],
        },
    ],
})
export class UserStockOrder extends Model<UserStockOrder> {
    @ApiModelProperty({ description: 'ID' })
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    readonly id: string;

    @ApiModelProperty({ description: '股票ID' })
    @Column({
        type: DataType.UUID,
    })
    stockId: string;

    @ApiModelProperty({ description: '用户ID' })
    @Column({
        type: DataType.UUID,
    })
    userId: string;

    @ApiModelProperty({ description: '订单状态', enum: ConstData.ORDER_STATE })
    @Column({
        type: DataType.TINYINT,
    })
    state: ConstData.ORDER_STATE;

    @ApiModelProperty({ description: '订单类型', enum: ConstData.TRADE_ACTION })
    @Column({
        type: DataType.TINYINT,
    })
    type: ConstData.TRADE_ACTION;

    @ApiModelProperty({ description: '订单模式', enum: ConstData.TRADE_MODE })
    @Column({
        type: DataType.TINYINT,
    })
    mode: ConstData.TRADE_MODE;

    @ApiModelProperty({ description: '价格' })
    @Column({
        type: DataType.DECIMAL(20, 2),
    })
    price: number;

    @ApiModelProperty({ description: '手数' })
    @Column({
        type: DataType.BIGINT,
    })
    hand: number;
}