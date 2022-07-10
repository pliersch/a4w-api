import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Controller()
export class AppController {

  constructor(private readonly appService: AppService,) {
    // console.log('env: ', process.env.NODE_ENV)
  }


  @Get()
  getNestMessage(): string {
    return this.appService.getNestMessage();
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(10000).pipe(
      map((_) => ({data: {sse: 'ping'}} as MessageEvent)),
    );
  }

}
