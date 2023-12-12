## 개발 스택

|구분|내용|
|---|---|
|Language|TypeScript|
|Backend Framework|Nest.js|
|Frontend Framework|Next.js (for React.js)|
|Database ORM|Prisma|
|Tools|ESLint|

## 개발 환경 구축

```bash
$ npx create-next-app --ts --eslint <프로젝트>
```
### tsconfig.json 수정
```bash
{
  "compilerOptions": {
    ...,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization": false,
  }
}
```
### Nest.js 패키지 설치
```bash
$ npm install @nestjs/common @nestjs/core @nestjs/platform-express
```
### Prisma 설치
```bash
$ npm install prisma @prisma/client dotenv-cli @nestjs/cli --save-dev
$ npx prisma init
```
### Prisma 스키마 설정 (@/prisma/schema.prisma)
```bash
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model user {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  name      String?
}
```
### 데이터베이스 동기화 및 클래스 생성
```bash
$ npx prisma migrate dev
# Prisma 타입 오류 방지
$ npm install class-transformer class-validator
# 세팅된 스키마를 기반으로 클래스 생성
$ npx prisma generate resource
```
### Prisma 서비스 생성 (@/server)
```bash
$ nest g service prisma
```
### prisma.service.ts 수정
```bash
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
```
### app 서비스 구성 (@/server)
```bash
$ nest g service app
$ nest g controller app
$ nest g module app
```
### app/app.module.ts 수정
```bash
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';

import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    controllers: [AppController],
    providers: [AppService, PrismaService]
})
export class AppModule {}
```
### Swagger UI 설치
```bash
$ npm install --save @nestjs/swagger swagger-ui-express
```
### main.ts 파일 수정 (@/server/main.ts)
```bash
import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import * as http from "http";
import { NextApiHandler } from "next";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export module Main {
    let app: INestApplication;

    export async function getApp() {
        if (!app) {
            app = await NestFactory.create(AppModule, { bodyParser: false });
            
            const config = new DocumentBuilder()
                .setTitle('Swagger Example')
                .setDescription('Swagger study API description')
                .setVersion('1.0.0')
                .build();

            const documnet = SwaggerModule.createDocument(app, config);

            SwaggerModule.setup('api', app, documnet);
            
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
```