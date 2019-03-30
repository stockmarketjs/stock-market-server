import { Table, Column, Model, Unique, DataType } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';

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
  })
  readonly id: string;

  @ApiModelProperty({ description: '帐号' })
  @Column({
    unique: true,
  })
  readonly account: string;

  @ApiModelProperty({ description: '密码' })
  @Column
  readonly password: string;
}