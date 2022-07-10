import { Module } from '@nestjs/common';
import { config } from './config';
import { join } from 'path';
import * as configuration from "./config/config.develop";
import { ServeStaticModule } from '@nestjs/serve-static';
import { ChatModule } from "@modules/chat/chat.module";
import { DownloadModule } from "@modules/download/download.module";
import { PhotosModule } from "@modules/photos/photos.module";
import { SharpModule } from "nestjs-sharp";
import { TagsModule } from "@modules/tags/tags.module";
import { UsersModule } from "@modules/users/users.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PhotosModule,
    UsersModule,
    ChatModule,
    TagsModule,
    DownloadModule,
    // ConfigModule.forRoot({isGlobal: true, load: [configuration]}),
    SharpModule,
    TypeOrmModule.forRoot(config.database),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
}

// TODO complete env task! look in main.ts
// https://stackoverflow.com/questions/67166620/how-to-get-values-from-custom-configuration-file-in-nestjs-with-interface
function envConfig() {
  if (process.env.NODE_ENV === 'production') {
    // returns develop at the moment
    return configuration;
  }
  return configuration;
}
