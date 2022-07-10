import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getNestMessage(): string {
    return 'NestJS is running';
  }
}
