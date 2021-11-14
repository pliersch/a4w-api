import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
// import {ConfigService} from "@nestjs/config";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService,
                /*private configService: ConfigService*/) {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", new Date())
        // console.log('shit', configService.get<string>('foo'))
        console.log(process.env.NODE_ENV)
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
