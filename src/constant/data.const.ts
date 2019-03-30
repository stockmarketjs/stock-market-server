export namespace ConstData {

    export enum STOCK_MARKET {
        // 上海证券交易所
        SH = 'sh',
        // 深圳证券交易所
        SZ = 'sz'
    }

    export enum TRADE_ACTION {
        BUY = 0,
        SOLD = 1,
    }

    /**
     * 交易委托方式
     *
     * @export
     * @enum {number}
     */
    export enum TRADE_MODE {
        /**
         * 限价委托
         */
        LIMIT = 0,
        /**
         * 市价委托
         */
        MARKET = 1,
    }

}