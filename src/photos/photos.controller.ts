import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Photo } from './entites/photo.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';

@Controller('photos')
export class PhotosController {

  constructor(private photoService: PhotosService) {
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
  update(@Param('id') id: string, @Body() photo: Photo) {
    return this.photoService.update(/*+id, */photo);
  }

  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.photoService.removeOne(id);
  }


  // @Delete(':id')
  // removeMany(@Param('id') id: string) {
  //   return this.photoService.removeMany(+id);
  // }

  @UseInterceptors(FileInterceptor('image', createMulterStorage()))
  @Post('file')
  uploadFile( @Body() body: Photo, @UploadedFile() file: Express.Multer.File ) {
    body.fileName = 'http://localhost:3000/' + file.filename;
    return this.create(body);
  }
}

// function createPhotoFromBody(body) {
//
// }

function createMulterStorage() {
  return {
    storage: diskStorage({
      destination: './uploads',
      filename: function(req, file, cb) {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'))
        cb(null, file.fieldname + '-' + Date.now() + extension)
      }
    })
  }
}
