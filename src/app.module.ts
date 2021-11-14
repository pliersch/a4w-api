import {Module} from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
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

// TODO https://github.com/nestjs/config/blob/master/lib/interfaces/config-module-options.interface.ts
function foo() {
    if (process.env.NODE_ENV === 'production') {
        console.log('> production')
        return configuration;
    }
    console.log("> develop")
    return configuration;
}
