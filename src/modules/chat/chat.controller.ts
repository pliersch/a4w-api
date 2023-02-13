import { CreateMessageDto } from "@modules/chat/create-message-dto";
import { User } from "@modules/users/entities/user.entity";
import { Body, Controller, Delete, Get, Param, Post, Put, Sse } from '@nestjs/common';
import { Observable, Subject } from "rxjs";
import { getPostgresDataSource } from "../../postgres.datasource";
import { ChatService } from './chat.service';
import { Message } from './message.entity';

@Controller('chat')
export class ChatController {

  constructor(private readonly service: ChatService) { }

  // server sent MUST BE UNDER CONSTRUCTOR. OTHERWISE, A TYPEORM ERROR WILL THROW
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.changes$.asObservable();
  }

  private changes$: Subject<MessageEvent> = new Subject()

  private sendEvent(event: MessageEvent) {
    console.log('ChatController sendEvent: ', event)
    this.changes$.next(event)
  }

  @Post()
  async create(@Body() dto: CreateMessageDto) {
    const dataSource = await getPostgresDataSource();
    const userRepository = await dataSource.manager.getRepository(User);
    const user = await userRepository.findOneBy({id: dto.userId});
    const msg: Message = new Message();
    msg.text = dto.text;
    msg.user = user;
    msg.fileNames = null;
    setTimeout(() => this.sendEvent({data: {type: 'message_added'}} as MessageEvent), 500);
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
