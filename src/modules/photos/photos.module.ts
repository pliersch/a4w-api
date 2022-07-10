import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entites/photo.entity';
import { ConfigModule } from "@nestjs/config";
import { PhotoProcessorService } from './photo-processor.service';
import { SharpService } from "nestjs-sharp";

// import { PhotoExifReaderService } from "./photo-exif-reader.service";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Photo])
  ],
  providers: [PhotosService, PhotoProcessorService, /*PhotoExifReaderService,*/ SharpService],
  controllers: [PhotosController]
})
export class PhotosModule {
}
