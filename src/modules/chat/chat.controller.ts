import { CreateMessageDto, QueryMessagesDto } from "@modules/chat/chat.model";
import { User } from "@modules/users/entities/user.entity";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Sse,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { diskStorage } from "multer";
import { Observable, Subject } from "rxjs";
import { DeleteResult } from "typeorm";
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
    const message = await this.service.create(msg);
    // don't send user obj, only user id.
    const payload = await this.service.findOne(message.id);
    const event = {
      data: {
        type: 'message_added',
        payload: payload
      }
    };
    setTimeout(() => this.sendEvent(event as MessageEvent), 300);
    return message;
  }

  @Get()
  findAll(@Query() dto: QueryMessagesDto) {
    return this.service.findAll(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() message: Message) {
    return this.service.update(/*id,*/ message);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.removeOne(id);
  }

  @Post('deleteAll')
  async deleteAll(): Promise<DeleteResult> {
    return this.service.deleteAll();
  }

  // body is type 'any' because we must parse the json string :(
  @UseInterceptors(FileInterceptor('image', createMulterStorage()))
  @Post('pictures')
  async uploadFile(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    const dataSource = await getPostgresDataSource();
    const userRepository = await dataSource.manager.getRepository(User);
    const user = await userRepository.findOneBy({id: dto.userId});
    const msg: Message = new Message();
    msg.text = dto.text;
    msg.user = user;
    msg.fileNames = [file.filename];
    const message = await this.service.create(msg);

    // todo thumbs
    // await this.fileService.createThumb(photo.fileName);
    // don't send user obj, only user id.
    const payload = await this.service.findOne(message.id);
    const event = {
      data: {
        type: 'message_added',
        payload: payload
      }
    };
    setTimeout(() => this.sendEvent(event as MessageEvent), 300);
    return message;
  }
}

// todo duplicated (PhotosController) create a service?!
function createMulterStorage() {
  return {
    storage: diskStorage({
      destination: './static/images/chat',
      filename: function (req, file, cb) {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + Date.now() + extension);
      }
    })
  }
}
