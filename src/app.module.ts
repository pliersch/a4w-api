import {Module} from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {config} from './config';
import {join} from 'path';
import {DownloadModule} from './download/download.module';
import {PhotosModule} from './photos/photos.module';
import {UsersModule} from './users/users.module';
import {ChatModule} from './chat/chat.module';
import {TagsModule} from './tags/tags.module';
import * as configuration from "./config/config.develop";
import {SharpModule} from "nestjs-sharp";

@Module({
  imports: [
    PhotosModule,
    UsersModule,
    ChatModule,
    TagsModule,
    DownloadModule,
    // ConfigModule.forRoot({load: [foo()]}),
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
function foo() {
  if (process.env.NODE_ENV === 'production') {
    return configuration;
  }
  return configuration;
}
