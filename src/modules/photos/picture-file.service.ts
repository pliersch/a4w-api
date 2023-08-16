import { Injectable } from '@nestjs/common';
import * as fs from 'fs'
import { SharpService } from "nestjs-sharp";
import * as path from "path";

export type ThumbSize = 300 | 600 | 900

@Injectable()
export class PictureFileService {

  private readonly filePath = './static/images/';
  private readonly original = 'full/';
  private readonly thumbs = 'thumbs/';
  private readonly pathFull = './static/images/gallery/full/';
  private readonly pathThumbs = './static/images/gallery/thumbs/';

  constructor(private sharpService: SharpService) { }

  async savePicture(fileName: string, folderName: string, sizes: ThumbSize[]): Promise<void> {
    const promises: Promise<boolean>[] = [];

    const input: string = path.resolve(this.filePath + folderName + '/' + this.original);
    const output: string = path.resolve(this.filePath + folderName + '/' + this.thumbs);

    try {
      for (const size of sizes) {
        const webpFile: string = path.basename(fileName, path.extname(fileName)) + '-' + size + '.webp';
        const toPath: string = path.join(output, webpFile);
        const fromPath: string = path.join(input, fileName);
        promises.push(this.generate(fromPath, toPath, size));
      }
    } catch (e) {
      console.error("We've thrown! Whoops!", e);
    }
    await Promise.all(promises);
    return;
  }

  private async generate(inputPath: string, outputPath: string, width: number): Promise<boolean> {
    const sharp = await this.sharpService.edit(inputPath);
    const metadata = await sharp.metadata()
    if (metadata.width * 0.9 < width) { // no thumbs when source is too small. scale up 10% on site is ok
      return new Promise(function (resolve) {
        resolve(true);
      });
    } else {
      try {
        await sharp.resize(width).toFile(outputPath);
        return new Promise(function (resolve) {
          resolve(true);
        });
      } catch (e) {
        console.log('PictureFileService generate error: ', e)
        return new Promise(function (resolve) {
          resolve(false);
        });
      }

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

  private deleteFile(path: string, fileName: string): void {
    fs.unlink(path + fileName,
      res => console.error('error: ', res));
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

}
