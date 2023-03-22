import { Injectable } from '@nestjs/common';
import * as fs from 'fs'
import { SharpService } from "nestjs-sharp";
import * as path from "path";

@Injectable()
export class PhotoFileService {

  private readonly sizes = [300, 600, 900, 1800];
  private readonly pathFull = './static/images/gallery/full/';
  private readonly pathThumbs = './static/images/gallery/thumbs/';

  constructor(private sharpService: SharpService) { }

  async createThumb(fileName: string/*, inputDirectory?: string, outputDirectory?: string*/): Promise<void> {
    const promises = [];
    // const input = inputDirectory ? inputDirectory + fileName : path.resolve(this.pathFull);
    // const output = outputDirectory ? outputDirectory : path.resolve(this.pathThumbs);
    const input = path.resolve(this.pathFull);
    const output = path.resolve(this.pathThumbs);
    const sizes = this.sizes;
    try {
      for (const size of sizes) {
        const webpFile = path.basename(fileName, path.extname(fileName)) + '-' + size + '.webp';
        const toPath = path.join(output, webpFile);
        const fromPath = path.join(input, fileName);
        promises.push(this.generate(fromPath, toPath, size));
      }
    } catch (e) {
      console.error("We've thrown! Whoops!", e);
    }
    Promise.all(promises)
      .then(() => {
        return 1;
      })
      .catch((e) => {
        console.log('PhotosProcessor error: ',)
      });
  }

  private async generate(inputPath: string, outputPath: string, width: number): Promise<void> {
    const image = await this.sharpService.edit(inputPath);
    const metadata = await image.metadata()
    if (metadata.width * 0.9 < width) { // no thumbs when source is too small. scale up 10% on site is ok
      return new Promise(function (resolve) {
        resolve();
      });
    } else {
      await image.resize(width).toFile(outputPath, (err, info) => {
        if (err) {
          console.log('PhotoProcessorService generate err: ', err)
        }
      });
    }
  }

  deletePhoto(fileName: string): void {
    this.deleteFile(this.pathFull, fileName);
    const name = fileName.substring(0, fileName.lastIndexOf('.'));
    const sizes = this.sizes;
    for (const size of sizes) {
      const thumbName = name + '-' + size + '.webp';
      this.deleteFile(this.pathThumbs, thumbName);
    }
  }

  deleteAllPhotos(): void {
    const directories = [this.pathFull, this.pathThumbs];
    directories.forEach(directory => {
      fs.readdir(directory, (err, files) => {
        if (err) {
          throw err;
        }
        for (const file of files) {
          fs.unlink(path.join(directory, file), (err) => {
            if (err) {
              throw err;
            }
          });
        }
      });
    })
  }

  private deleteFile(path: string, fileName: string): void {
    fs.unlink(path + fileName,
      res => console.error('error: ', res));
  }
}
