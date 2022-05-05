import {Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import {PhotosService} from './photos.service';
import {Photo} from './entites/photo.entity';
import {FileInterceptor} from '@nestjs/platform-express';
import {Express} from 'express';
import {diskStorage} from 'multer';
import {UpdatePhotoDto} from "./dto/update-photo.dto";
import {PhotoProcessorService} from "./photo-processor.service";
import * as path from "path";

@Controller('photos')
export class PhotosController {

  constructor(private photoService: PhotosService,
              private photoProcessor: PhotoProcessorService) {
  }

  @Post()
  async create(@Body() photo: Photo): Promise<Photo> {
    return this.photoService.create(photo);
  }

  @Get()
  async findAll(): Promise<Photo[]> {
    return this.photoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Photo> {
    return this.photoService.findOne(id);
  }

  @Put(':id')
  replace(@Param('id') id: string, @Body() photo: Photo) {
    return this.photoService.replace(/*+id, */photo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePhotoDto) {
    return this.photoService.update(id, dto);
  }

  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.photoService.removeOne(id);
  }

  // body is type 'any' because we must parse the json string :(
  @UseInterceptors(FileInterceptor('image', createMulterStorage()))
  @Post('file')
  uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const photo = {} as Photo;
    photo.tags = JSON.parse(body.tags);
    photo.fileName = file.filename;
    this.photoProcessor.createThumb(photo.fileName);
    console.log('photo before save', photo);
    return this.create(photo);
  }

}

function createMulterStorage() {
  return {
    storage: diskStorage({
      destination: './static/images/gallery/full',
      filename: function (req, file, cb) {
        console.log(' filename: ',)
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'))
        cb(null, file.fieldname + '-' + Date.now() + extension)
      }
    })
  }
}
