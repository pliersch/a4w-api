import { Controller, Get, Param } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Photo } from './entites/photo.entity';

@Controller('photos')
export class PhotosController {

  constructor(private photoService: PhotosService) {
  }

  @Get()
  findAll(): Promise<Photo[]> {
    return this.photoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Photo> {
    return this.photoService.findAll()[0];
  }
}
