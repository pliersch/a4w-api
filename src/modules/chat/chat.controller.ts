import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ChatService} from './chat.service';
import {Message} from './message.entity';

@Controller('chat')
export class ChatController {

  constructor(private readonly service: ChatService) {
  }

  @Post()
  create(@Body() message: Message) {
    return this.service.create(message);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() message: Message) {
    return this.service.update(/*id,*/ message);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.removeOne(id);
  }
}
