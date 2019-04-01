import { Table, Column, Model, Unique, DataType } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
})
export class UserCapital extends Model<UserCapital> {
    @ApiModelProperty({ description: 'ID' })
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    readonly id: string;

    @ApiModelProperty({ description: '员工ID' })
    @Column({
        type: DataType.UUID,
        unique: true,
    })
    userId: string;

    @ApiModelProperty({ description: '持有资金' })
    @Column({
        type: DataType.BIGINT,
    })
    cash: number;

}