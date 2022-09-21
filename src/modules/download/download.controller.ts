import { Body, Controller, Post, Response, StreamableFile } from '@nestjs/common';
import { DownloadService } from "./download.service";
import { createReadStream } from "fs";
import { join, resolve } from "path";
import * as JSZip from 'jszip';

@Controller('download')
export class DownloadController {

  constructor(private readonly service: DownloadService) {
  }

  @Post()
  async getFile(@Body() fileNames: string[], @Response({passthrough: true}) res): Promise<StreamableFile> {
    const result = 'pictures_' + new Date().getTime() + '.zip';
    const zip = new JSZip();
    const img = zip.folder("pictures");
    const pictureFolder: string = resolve('./static/images/gallery/full');
    let picture;
    for (const fileName of fileNames) {
      picture = createReadStream(join(pictureFolder, fileName));
      img.file(fileName, picture, {base64: true});
    }

    const uint8Array = await zip.generateAsync({type: "uint8array"});

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=' + result,
    });
    return new StreamableFile(uint8Array)
  }

}
