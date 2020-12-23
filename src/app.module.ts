import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotosModule } from './photos/photos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PhotosModule,
    TypeOrmModule.forRoot(config.database),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
