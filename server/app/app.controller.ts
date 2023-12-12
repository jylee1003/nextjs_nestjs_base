import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/app')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        console.log('process.', process.env.NODE_ENV)	//	<- development
        console.log('NEXT_MODE.', process.env.NEXT_PUBLIC_MODE)	//	<- staging
        return this.appService.getHello();
    }
}
