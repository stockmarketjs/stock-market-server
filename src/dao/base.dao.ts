import { Injectable, Inject } from '@nestjs/common';
import { ConstProvider } from 'src/constant/provider.const';
import { Sequelize, Model } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';

@Injectable()
export class BaseDao<T extends Model<T>> {

    protected readonly entity: (new () => T);

    constructor(
        @Inject(ConstProvider.SEQUELIZE) protected readonly sequelize: Sequelize,
    ) { }

    public async findOne(option: FindOptions) {
        return this.sequelize.getRepository(this.entity).findOne(option);
    }

}