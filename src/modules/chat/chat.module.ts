import { PictureFileService } from "@modules/photos/picture-file.service";
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharpService } from "nestjs-sharp";
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Message } from './message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message])
  ],
  providers: [ChatService, PictureFileService, SharpService],
  controllers: [ChatController]
})
export class ChatModule {}
