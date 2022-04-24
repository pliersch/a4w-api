import fs from "fs";
import path from "path";
import {SharpService} from "nestjs-sharp";

export class PhotosProcessor {

  private sizes: number[] = [300, 600];

  constructor(private sharpService: SharpService) {
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
