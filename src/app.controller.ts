import {Controller, Get, Sse} from '@nestjs/common';
import {AppService} from './app.service';
import {interval, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {SharpService} from "nestjs-sharp";
import * as fs from "fs";
import * as path from 'path';

@Controller()
export class AppController {

  private sizes: number[] = [300, 600];

  constructor(private readonly appService: AppService,
              private sharpService: SharpService) {
    // console.log('env: ', process.env.NODE_ENV)

    this.createThumbs(
      path.resolve('./static/images/gallery/full'),
      path.resolve('./static/images/gallery/thumbs'),
      this.sizes)
      .then(r => console.log(r));
  }

  async createThumbs(inputPath: string, outputPath: string, sizes: number[]) {
    try {
      const files = await fs.promises.readdir(inputPath);
      console.log(files)
      for (const file of files) {
        const fromPath = path.join(inputPath, file);
        const stat = await fs.promises.stat(fromPath);
        if (stat.isFile()) {
          for (const size of sizes) {
            const webpFile = path.basename(file, path.extname(file)) + '-' + size + '.webp';
            const toPath = path.join(outputPath, webpFile);
            await this.generate(fromPath, toPath, size)
          }
        }
      }
    } catch (e) {
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

  async generate(inputPath: string, outputPath: string, width: number): Promise<void> {
    await this.sharpService.edit(inputPath)
      .resize(width)
      .toFile(outputPath, (err, info) => {
        if (err) {
          console.log('AppController gen err: ', err)
        }
      });
  }
}
