import { Table, Column, Model, Unique, DataType } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { ConstData } from 'src/constant/data.const';
import { $ } from 'src/common/util/function';
import { Utils } from 'sequelize';

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export class StockCapital extends Model<StockCapital> {
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
        unique: true,
    })
    stockId: string;

    @ApiModelProperty({ description: '总股本' })
    @Column({
        type: DataType.BIGINT,
    })
    generalCapital: number;

}