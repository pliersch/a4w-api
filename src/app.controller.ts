import {Controller, Get, Sse} from '@nestjs/common';
import {AppService} from './app.service';
import {interval, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {SharpService} from "nestjs-sharp";
import * as fs from "fs";
import {PathLike} from "fs";
import * as path from 'path';

@Controller()
export class AppController {
  private moveFrom: PathLike = '/uploads';

  constructor(private readonly appService: AppService,
              private sharpService: SharpService) {
    // console.log('env: ', process.env.NODE_ENV)
    // console.log(this.listDir(path.resolve('./uploads')).then(console.log))

    this.foo(
      path.resolve('./uploads'),
      path.resolve('./thumbs'))
      .then(r => console.log(r));

    // void this.generate('uploads/image-1608753157569.jpg', 'uploads/output.webp')
  }

  async listDir(s: string): Promise<string[]> {
    console.log(s)
    try {
      return fs.promises.readdir(s);
    } catch (err) {
      console.error('Error occurred while reading directory!', err);
    }
  }

  async foo(inputPath: string, outputPath: string) {
    try {
      const files = await fs.promises.readdir(inputPath);
      for (const file of files) {
        const fromPath = path.join(inputPath, file);
        const webpFile = path.basename(file, path.extname(file)) + '.webp';
        const toPath = path.join(outputPath, webpFile);

        const stat = await fs.promises.stat(fromPath);

        if (stat.isFile()) {
          console.log("'%s' is a file.", fromPath);
        } else if (stat.isDirectory()) {
          console.log("'%s' is a directory.", fromPath);
        }

        await this.generate(fromPath, toPath)
        // Now move async
        // await fs.promises.rename(fromPath, toPath);

        // Log because we're crazy
        console.log("Moved '%s'->'%s'", fromPath, toPath);
      }
    } catch (e) {
      // Catch anything bad that happens
      console.error("We've thrown! Whoops!", e);
    }

  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(10000).pipe(
      map((_) => ({data: {sse: 'ping'}} as MessageEvent)),
    );
  }

  async generate(inputPath: string, outputPath: string): Promise<void> {
    await this.sharpService.edit(inputPath)
      .resize(320)
      .toFile(outputPath, (err, info) => {
        if (err) {
          console.log('AppController gen err: ', err)
        }
        // if (info) {
        //   console.log('AppController gen: yes', info)
        // }
      });
  }

  async generate2(fileName: string, path: string, fileType: string): Promise<void> {
    await this.sharpService.edit(path + '/' + fileName + '.' + fileType)
      .resize(320)
      .toFile(path + '/' + fileName + '.' + fileType, (err, info) => {
        if (err) {
          console.log('AppController gen err: ', err)
        }
        if (info) {
          console.log('AppController gen: yes', info)
        }
      });
  }
}
