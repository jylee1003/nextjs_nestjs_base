import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as http from "http";
import { NextApiHandler } from "next";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { GlobalExceptionFilter } from './exception/global.exception.filter';

export module Main {
    let app: INestApplication;

    export async function getApp() {
        if (!app) {
            app = await NestFactory.create(AppModule, { bodyParser: false });
            
            const config = new DocumentBuilder()
                .setTitle('Swagger Example')
                .setDescription('Swagger study API description')
                .setVersion('1.0.0')
                .addBearerAuth(
                    { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
                    'access-token'
                )
                .build();

            const documnet = SwaggerModule.createDocument(app, config);

            SwaggerModule.setup('api', app, documnet);

            app.useGlobalFilters(new GlobalExceptionFilter());
            
            await app.init();
        }

        return app;
    }

    export async function getListener() {
        const app = await getApp();
        const server: http.Server = app.getHttpServer();
        const [listner] = server.listeners("request") as NextApiHandler[];

        return listner;
    }
}