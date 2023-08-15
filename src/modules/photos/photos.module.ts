import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharpService } from "nestjs-sharp";
import { Photo } from './entites/photo.entity';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { PictureFileService } from './picture-file.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Photo])
  ],
  providers: [PhotosService, PictureFileService, SharpService],
  controllers: [PhotosController]
})
export class PhotosModule {
}
