import {
  DeletePhotoResultDto,
  PhotoMetaDataDto,
  PhotosRequestDto,
  PhotosResultDto,
  UpdatePhotoDto
} from "@modules/photos/dto/photo.dto";
import { Tag } from "@modules/tags/entities/tag.entity";
import { User } from "@modules/users/entities/user.entity";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Sse,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';

import { Observable, Subject } from "rxjs";
import { DeleteResult, In } from "typeorm";
import { getPostgresDataSource } from "../../postgres.datasource";
import { Photo } from './entites/photo.entity';
import { PhotoFileService } from "./photo-file.service";
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {

  constructor(private photoService: PhotosService,
              private fileService: PhotoFileService) {
  }

  // server sent MUST BE UNDER CONSTRUCTOR. OTHERWISE, A TYPEORM ERROR WILL THROW
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.changes$.asObservable();
  }

  private changes$: Subject<MessageEvent> = new Subject()

  private sendEvent(event: MessageEvent) {
    this.changes$.next(event)
  }

  @Get('meta')
  async getMetaData(): Promise<PhotoMetaDataDto> {
    return this.photoService.getMetaData();
  }

  @Get()
  async getPhotos(@Query() dto: PhotosRequestDto): Promise<PhotosResultDto> {
    return this.photoService.getPhotos(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Photo> {
    return this.photoService.findOne(id);
  }

  @Put(':id')
  async replace(@Param('id') id: string, @Body() photo: Photo) {
    return this.photoService.replace(/*+id, */photo);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePhotoDto) {
    const photo = await this.photoService.findOneWithTags(id);
    const dataSource = await getPostgresDataSource();
    const tagRepository = await dataSource.manager.getRepository(Tag);
    if (dto.addedTagIds || dto.removedTagIds) {
      const removedTags = await tagRepository.findBy({
        id: In(dto.removedTagIds)
      });
      photo.tags = photo.tags.filter(tag => !removedTags.find(tag2 => tag.id === tag2.id));
      const addedTags = await tagRepository.findBy({
        id: In(dto.addedTagIds)
      });
      photo.tags.push(...addedTags);
    }
    if (dto.private) {
      photo.isPrivate = dto.private;
    }
    if (dto.rating) {
      photo.rating = dto.rating;
    }
    return this.photoService.update(id, photo);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<DeletePhotoResultDto> {
    const photo = await this.photoService.removeOne(id);
    this.fileService.deletePhoto(photo.fileName);
    return new Promise(function (resolve) {
      resolve({id: id});
    });
  }

  @Post('delmany')
  async deleteMany(@Body() dto: { ids: string[] }): Promise<DeleteResult> {
    const results: DeletePhotoResultDto[] = [];
    for (const id of dto.ids) {
      results.push(await this.deleteOne(id));
    }
    return {
      raw: [],
      affected: results.length
    };
  }

  // only used with upload
  // @Post()
  async create(@Body() photo: Photo): Promise<Photo> {
    return this.photoService.create(photo);
  }

  // body is type 'any' because we must parse the json string :(
  @UseInterceptors(FileInterceptor('image', createMulterStorage()))
  @Post('file')
  async uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const dataSource = await getPostgresDataSource();
    const photo = {} as Photo;
    photo.tags = JSON.parse(body.tags);
    photo.recordDate = new Date(body.created);
    photo.isPrivate = JSON.parse(body.isPrivate);
    photo.user = await dataSource.manager.findOneBy(User, {id: body.userid});
    photo.fileName = file.filename;
    await this.fileService.createThumb(photo.fileName);
    const promise = this.photoService.create(photo);
    setTimeout(() => this.sendEvent({data: {type: 'photo_added'}} as MessageEvent), 300);
    return promise;
  }
}

function createMulterStorage() {
  return {
    storage: diskStorage({
      destination: './static/images/gallery/full',
      filename: function (req, file, cb) {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + Date.now() + extension);
      }
    })
  }
}
