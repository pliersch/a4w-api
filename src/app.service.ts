import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getNestMessage(): string {
    return 'Nest is running';
  }
}
