import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {

    private readonly envConfig: { [key: string]: string };

    constructor(filePath: string) {
        this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    get port(): number {
        return Number(this.envConfig.SERVER_PORT);
    }

    get dbMysql(): {
        dialect: 'mysql',
        host: string,
        port: number,
        username: string,
        password: string,
        database: string,
    } {
        return {
            dialect: 'mysql',
            host: this.envConfig.DB_MYSQL_HOST,
            port: Number(this.envConfig.DB_MYSQL_PORT),
            username: this.envConfig.DB_MYSQL_USERNAME,
            password: this.envConfig.DB_MYSQL_PASSWORD,
            database: this.envConfig.DB_MYSQL_DATABASE,
        };
    }

}