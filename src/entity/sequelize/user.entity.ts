import { Table, Column, Model, Unique, DataType } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { ConstData } from '../../constant/data.const';

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
    defaultScope: {
        attributes: { exclude: ['password'] },
    },
    scopes: {
        all: {
            attributes: { exclude: [] },
        },
    },
})
export class User extends Model<User> {
    @ApiModelProperty({ description: 'ID' })
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    readonly id: string;

    @ApiModelProperty({ description: '帐号' })
    @Column({
        unique: true,
        allowNull: false,
    })
    readonly account: string;

    @ApiModelProperty({ description: '密码' })
    @Column({
        allowNull: false,
    })
    readonly password: string;

    @ApiModelProperty({ description: '是否是机器人', required: false, default: ConstData.Boolean.FALSE })
    @Column({
        type: DataType.TINYINT,
        defaultValue: ConstData.Boolean.FALSE,
        allowNull: false,
    })
    readonly isRobot: ConstData.Boolean = ConstData.Boolean.FALSE;
}