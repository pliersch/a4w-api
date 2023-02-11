import { CreateMessageDto } from "@modules/chat/create-message-dto";
import { User } from "@modules/users/entities/user.entity";
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { getPostgresDataSource } from "../../postgres.datasource";
import { ChatService } from './chat.service';
import { Message } from './message.entity';

@Controller('chat')
export class ChatController {

  constructor(private readonly service: ChatService) { }

  @Post()
  async create(@Body() dto: CreateMessageDto) {
    console.log('ChatController create: ', dto)
    const dataSource = await getPostgresDataSource();
    const userRepository = await dataSource.manager.getRepository(User);
    const user = await userRepository.findOneBy({id: dto.userId});
    console.log('ChatController create: ', user)
    const msg: Message = new Message();
    msg.text = dto.text;
    msg.user = user;
    msg.fileNames = null;
    return this.service.create(msg);
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
