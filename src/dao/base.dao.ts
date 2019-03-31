import { Injectable, Inject } from '@nestjs/common';
import { ConstProvider } from 'src/constant/provider.const';
import { Sequelize, Model } from 'sequelize-typescript';
import { FindOptions, UpdateOptions, CreateOptions } from 'sequelize';

@Injectable()
export class BaseDao<T extends Model<T>> {

    protected readonly entity: (new () => T);

    constructor(
        @Inject(ConstProvider.SEQUELIZE) protected readonly sequelize: Sequelize,
    ) { }

    public async findOne(option: FindOptions) {
        return this.sequelize.getRepository(this.entity).findOne(option);
    }

    public async update(data: Partial<T>, option: UpdateOptions) {
        const [updateCount] = await this.sequelize.getRepository(this.entity).update(data, option);
        return updateCount === 0 ? false : true;
    }

    public async findAll(option?: FindOptions) {
        return this.sequelize.getRepository(this.entity).findAll(option);
    }

    public async create(data: Partial<T>, option?: CreateOptions) {
        return this.sequelize.getRepository(this.entity).create(data, option);
    }

}