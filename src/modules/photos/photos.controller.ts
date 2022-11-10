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
import * as fs from "fs";
import { PhotosService } from './photos.service';
import { Photo } from './entites/photo.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { UpdatePhotoDto } from "./dto/update-photo.dto";
import { PhotoProcessorService } from "./photo-processor.service";
import { DeletePhotoResultDto } from "./dto/delete-photo-result.dto";
import { PageOptionsDto } from "@common/dtos/page-options.dto";
import { PhotoMetaDataDto } from "./dto/photo-meta-data-result.dto";
import { PhotosResultDto } from "./dto/photos-result.dto";
import { Observable, Subject } from "rxjs";
import { User } from "@modules/users/entities/user.entity";
import { getPostgresDataSource } from "../../postgres.datasource";
import { DeleteResult } from "typeorm";

@Controller('photos')
export class PhotosController {

  constructor(private photoService: PhotosService,
              private photoProcessor: PhotoProcessorService) {

  }

  // server sent MUST BE UNDER CONSTRUCTOR. OTHERWISE, A TYPEORM ERROR WILL THROW

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.changes$.asObservable();
  }

  private changes$: Subject<MessageEvent> = new Subject()

  private sendEvent(project: MessageEvent) {
    this.changes$.next(project)
  }

  @Get('meta')
  async getMetaData(): Promise<PhotoMetaDataDto> {
    return this.photoService.getMetaData();
  }

  @Get()
  async getPhotos(@Query() pageOptionsDto: PageOptionsDto): Promise<PhotosResultDto> {
    return this.photoService.getPhotos(pageOptionsDto);
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
    return this.photoService.update(id, dto);
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string): Promise<DeletePhotoResultDto> {
    const promise = this.photoService.removeOne(id);
    promise.then(photo => this.deletePhoto(photo.fileName));
    return new Promise(function (resolve) {
      resolve({id: id});
    });
  }

  // todo: make process async
  private deletePhoto(fileName: string): void {
    fs.unlink('./static/images/gallery/full/' + fileName,
      res => console.error('error full: ', res));
    const name = fileName.substring(0, fileName.lastIndexOf('.'));
    const name300 = name + '-300.webp';
    const name600 = name + '-600.webp';
    fs.unlink('./static/images/gallery/thumbs/' + name300,
      res => console.error('error 300: ', res));
    fs.unlink('./static/images/gallery/thumbs/' + name600,
      res => console.error('error 600: ', res));
  }

  // @Post('delmany')
  // async deleteMany(@Body() dto: { ids: string[] }): Promise<DeleteResult> {
  //   return this.photoService.deleteMany(dto.ids);
  // }

  // only used with upload
  // @Post()
  async create(@Body() photo: Photo): Promise<Photo> {
    return this.photoService.create(photo);
  }

  // body is type 'any' because we must parse the json string :(
  @UseInterceptors(FileInterceptor('image', createMulterStorage()))
  @Post('file')
  async uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const photo = {} as Photo;
    photo.tags = JSON.parse(body.tags);
    photo.recordDate = JSON.parse(body.created);
    const dataSource = await getPostgresDataSource();
    photo.user = await dataSource.manager.findOneBy(User, {id: body.userid});
    photo.fileName = file.filename;
    await this.photoProcessor.createThumb(photo.fileName);
    const promise = this.photoService.create(photo);
    setTimeout(() => this.sendEvent({data: {type: 'photo_added'}} as MessageEvent), 1000);
    return promise;
  }
}

function createMulterStorage() {
  return {
    storage: diskStorage({
      destination: './static/images/gallery/full',
      filename: function (req, file, cb) {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'))
        cb(null, file.fieldname + '-' + Date.now() + extension)
      }
    })
  }
}
