import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middleware/logger.middleware';
import { ValidationPipe, Logger } from '@nestjs/common';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OrderService } from './service/order.service';
import { CronJob } from 'cron';
import { AuthService } from './service/auth.service';
import { $ } from './common/util/function';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        { bodyParser: true },
    );

    app.use(logger);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
        validationError: {
            target: false,
            value: false,
        },
    }));

    const options = new DocumentBuilder()
        .setTitle('API 文档')
        .setVersion('1.0')
        .addBearerAuth('Authorization', 'header', 'apiKey')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    const orderService = app.get(OrderService);
    const authService = app.get(AuthService);
    const handleJob = new CronJob('*/30 * * * * *', async () => {
        Logger.log('核算开始');
        await orderService.handle();
        Logger.log('核算结束');
    });
    handleJob.start();
    const createRobotJob = new CronJob('0 */20 * * * *', async () => {
        Logger.log('创建机器人开始');
        await authService.register({
            account: `robot_${$.getUuid()}`,
            password: $.getUuid(),
        });
        Logger.log('创建机器人结束');
    });
    createRobotJob.start();

    await app.listen(3000);
}
bootstrap();
