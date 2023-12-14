import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { GlobalExceptionFilter } from './exception/global.exception.filter';

import { UserModule } from './user/user.module';

@Module({
    imports: [UserModule],
    controllers: [AppController],
    providers: [AppService, PrismaService, {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter
    }]
})
export class AppModule {}
