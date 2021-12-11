import {Module} from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {config} from './config';
import {join} from 'path';
import {PhotosModule} from './photos/photos.module';
import {UsersModule} from './users/users.module';
import {ChatModule} from './chat/chat.module';
import {TagsModule} from './tags/tags.module';
import * as configuration from "./config/config.develop";

@Module({
  imports: [
    PhotosModule,
    UsersModule,
    ChatModule,
    TagsModule,
    // ConfigModule.forRoot({load: [foo()]}),
    TypeOrmModule.forRoot(config.database),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
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
