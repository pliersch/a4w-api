import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  StreamableFile,
  Response,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {PhotosService} from './photos.service';
import {Photo} from './entites/photo.entity';
import {FileInterceptor} from '@nestjs/platform-express';
import {Express} from 'express';
import {diskStorage} from 'multer';
import {createReadStream} from "fs";
import {join} from "path";

@Controller('photos')
export class PhotosController {

  constructor(private photoService: PhotosService) {
  }

  @Post()
  async create(@Body() photo: Photo): Promise<Photo> {
    console.log('id', photo.id);
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
  update(@Param('id') id: string, @Body() photo: Photo) {
    return this.photoService.update(/*+id, */photo);
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
    photo.fileName = 'http://localhost:3000/' + file.filename;
    console.log('photo before save', photo);
    return this.create(photo);
  }

}

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
