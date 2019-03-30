import _ from 'lodash';

export class Calc {

    public static formatToPer(per: number) {
        return _.round(per, 2);
    }

    /**
     * 假设购买股票后, 计算剩余金额
     *
     * @static
     * @param {number} money
     * @param {number} price
     * @param {number} hand
     * @returns
     * @memberof Calc
     */
    public static calcStockBuyRemain(money: number, price: number, hand: number) {
        const handPerStock = 100;

        const amount = hand * handPerStock;
        return money - price * amount;
    }

}