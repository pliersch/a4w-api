import { Injectable } from "@nestjs/common";
import * as ExifReader from 'exifreader';
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class PhotoExifReaderService {

  async readDirectory(inputPath: string): Promise<void> {
    console.log('PhotoExifReaderService readDirectory: ', inputPath)
    const inputDirectory = path.resolve(inputPath)
    console.log('PhotoExifReaderService readDirectory: ', inputDirectory)
    const files = await fs.promises.readdir(inputDirectory);
    for (const file of files) {
      console.log('PhotoExifReaderService readDirectory: ', file)
      await this.read(inputDirectory + '\\' + file)
    }
  }

  async read(file: string): Promise<void> {
    console.log('PhotoExifReaderService read: ', file)
    const tags = await ExifReader.load(file);
    const imageDate = tags['DateTimeOriginal'].description;
    const unprocessedTagValue = tags['DateTimeOriginal'].value;
    console.log('PhotoExifReaderService read: ', imageDate, unprocessedTagValue)
  }
}
