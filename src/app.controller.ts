import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService,) {
    // console.log('env: ', process.env.NODE_ENV)
  }

  @Get()
  getNestMessage(): string {
    return this.appService.getNestMessage();
  }

}
