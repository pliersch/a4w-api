import { VisitsModule } from '@modules/admin/visits/visits.module';
import { ChatModule } from "@modules/chat/chat.module";
import { DownloadModule } from "@modules/download/download.module";
import { PhotosModule } from "@modules/photos/photos.module";
import { TagsModule } from "@modules/tags/tags.module";
import { UsersModule } from "@modules/users/users.module";
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharpModule } from "nestjs-sharp";
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';

@Module({
  imports: [
    VisitsModule,
    PhotosModule,
    UsersModule,
    ChatModule,
    TagsModule,
    // SocketModule,
    // ConfigModule.forRoot({isGlobal: true, load: [configuration]}),
    DownloadModule,
    SharpModule,
    TypeOrmModule.forRoot(config.database),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService/*, SocketGateway*/],
})

export class AppModule {}

// function envConfig() {
//   if (process.env.NODE_ENV === 'production') {
//     // returns develop at the moment
//     return configuration;
//   }
//   return configuration;
// }
