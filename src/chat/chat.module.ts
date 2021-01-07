import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message])
  ],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
