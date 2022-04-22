import {Controller, Get, Sse} from '@nestjs/common';
import {AppService} from './app.service';
import {interval, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {SharpService} from "nestjs-sharp";
import * as fs from "fs";
import * as path from 'path';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService,
              private sharpService: SharpService) {
    // console.log('env: ', process.env.NODE_ENV)

    this.foo(
      path.resolve('./static/images/gallery/full'),
      path.resolve('./static/images/gallery/thumbs'))
      .then(r => console.log(r));
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
