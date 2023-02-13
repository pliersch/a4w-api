import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { diskStorage } from "multer";

import { Repository, UpdateResult } from 'typeorm';
import { Message } from './message.entity';


@Injectable()
export class ChatService {

  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>,
  ) {
  }

  async create(message: Message): Promise<Message> {
    return await this.repository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return await this.repository.find({
      select: {
        user: {
          id: true,
          surName: true,
          givenName: true
        }
      },
      relations: {
        user: true
      },
      order: {
        created: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<Message> {
    return await this.repository.findOneBy({id: id});
  }

  async update(message: Message): Promise<UpdateResult> {
    return await this.repository.update(message.id, message);
  }

  async removeOne(id: string): Promise<Message> {
    const message = await this.repository.findOneBy({id: id});
    return await this.repository.remove(message);
  }

  // // body is type 'any' because we must parse the json string :(
  // @UseInterceptors(FileInterceptor('image', createMulterStorage()))
  // @Post('file')
  // uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File): Promise<Photo> {
  //   const photo = {} as Photo;
  //   photo.tags = JSON.parse(body.tags);
  //   photo.fileName = 'http://localhost:3000/' + file.filename;
  //   console.log('photo before save in db', photo);
  //   return this.create(photo);
  // }
}

// todo duplicated (PhotosController) create a service?!
function createMulterStorage() {
  return {
    storage: diskStorage({
      destination: './uploads',
      filename: function (req, file, cb) {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'))
        cb(null, file.fieldname + '-' + Date.now() + extension)
      }
    })
  }
}
