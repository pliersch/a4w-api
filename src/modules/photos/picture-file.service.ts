import { Injectable } from '@nestjs/common';
import * as fs from 'fs'
import { SharpService } from "nestjs-sharp";
import * as path from "path";

export type ThumbSize = 300 | 600 | 900

@Injectable()
export class PictureFileService {

  // private readonly sizes = [300, 600, 900, 1800];
  private readonly filePath = './static/images/';
  private readonly original = 'full/';
  private readonly thumbs = 'thumbs/';
  private readonly pathFull = './static/images/gallery/full/';
  private readonly pathThumbs = './static/images/gallery/thumbs/';

  constructor(private sharpService: SharpService) { }

  async savePicture(fileName: string, folderName: string, sizes: ThumbSize[]): Promise<void> {
    const promises = [];

    const input = path.resolve(this.filePath + folderName + '/' + this.original);
    const output = path.resolve(this.filePath + folderName + '/' + this.thumbs);

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

  deletePhoto(fileName: string, sizes: ThumbSize[]): void {
    this.deleteFile(this.pathFull, fileName);
    const name = fileName.substring(0, fileName.lastIndexOf('.'));
    for (const size of sizes) {
      const thumbName = name + '-' + size + '.webp';
      this.deleteFile(this.pathThumbs, thumbName);
    }
  }

  clearFolder(folderName: string): void {
    const original = this.filePath + folderName + '/' + this.original;
    const thumbs = this.filePath + folderName + '/' + this.thumbs;
    const directories = [original, thumbs];

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
