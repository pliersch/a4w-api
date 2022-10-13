import { Injectable } from '@nestjs/common';
import { SharpService } from "nestjs-sharp";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class PhotoProcessorService {

  private readonly sizes: number[] = [300, 600];
  private readonly defaultInput = path.resolve('./static/images/gallery/full');
  private readonly defaultOutput = path.resolve('./static/images/gallery/thumbs')

  constructor(private sharpService: SharpService) {
    //   this.createThumbs(
    //     path.resolve('./static/images/gallery/full'),
    //     path.resolve('./static/images/gallery/thumbs'),
    //     this.sizes)
    //     .then(r => console.log(r));
  }

  async createThumb(fileName: string, inputDirectory?: string, outputDirectory?: string, resolutions?: number[]): Promise<number> {
    const promises = [];
    const input = inputDirectory ? inputDirectory + fileName : this.defaultInput;
    const output = outputDirectory ? outputDirectory : this.defaultOutput;
    const sizes = resolutions ? resolutions : this.sizes;
    try {
      for (const size of sizes) {
        const webpFile = path.basename(fileName, path.extname(fileName)) + '-' + size + '.webp';
        const toPath = path.join(output, webpFile);
        const fromPath = path.join(input, fileName);
        promises.push(this.generate(fromPath, toPath, size));
        // await this.generate(fromPath, toPath, size);
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
    return 42;
  }

  async createThumbsByFolder(inputDirectory?: string, outputDirectory?: string, sizes?: number[]) {
    try {
      const input = inputDirectory ? inputDirectory : this.defaultInput;
      const output = outputDirectory ? outputDirectory : this.defaultOutput;
      const files = await fs.promises.readdir(inputDirectory);
      for (const file of files) {
        const fromPath = path.join(input, file);
        const stat = await fs.promises.stat(fromPath);
        if (stat.isFile()) {
          for (const size of sizes) {
            const webpFile = path.basename(file, path.extname(file)) + '-' + size + '.webp';
            const toPath = path.join(output, webpFile);
            await this.generate(fromPath, toPath, size)
          }
        }
      }
    } catch (e) {
      console.log('PhotoProcessorService createThumbsByFolder error: ', e);
    }
  }

  async generate(inputPath: string, outputPath: string, width: number): Promise<void> {
    await this.sharpService.edit(inputPath)
      .resize(width)
      .toFile(outputPath, (err, info) => {
        if (err) {
          console.log('PhotoProcessorService generate err: ', err)
        }
      });
  }
}
