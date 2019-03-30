import { Table, Column, Model, Unique, DataType } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { ConstData } from 'src/constant/data.const';

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['stock_id', 'user_id'],
        },
    ],
})
export class UserStock extends Model<UserStock> {
    @ApiModelProperty({ description: 'ID' })
    @Column({
        type: DataType.UUID,
        primaryKey: true,
    })
    readonly id: string;

    @ApiModelProperty({ description: '员工ID' })
    @Column({
        type: DataType.UUID,
        unique: true,
    })
    userId: string;

    @ApiModelProperty({ description: '股票ID' })
    @Column({
        type: DataType.UUID,
        unique: true,
    })
    stockId: string;

    @ApiModelProperty({ description: '陈本均价' })
    @Column({
        type: DataType.DECIMAL(20, 2),
    })
    costPrice: number;

    @ApiModelProperty({ description: '持仓数' })
    @Column({
        type: DataType.BIGINT,
    })
    amount: number;

}