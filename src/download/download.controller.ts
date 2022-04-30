import {Controller, Get, Response, StreamableFile} from '@nestjs/common';
import {DownloadService} from "./download.service";
import {createReadStream} from "fs";
import {join} from "path";
import * as JSZip from 'jszip';

@Controller('download')
export class DownloadController {

  constructor(private readonly service: DownloadService) {
  }

  @Get()
  async getFile(@Response({passthrough: true}) res): Promise<StreamableFile> {
    const zip = new JSZip();
    zip.file("hello.txt", "Hello World\n");
    if (JSZip.support.uint8array) {
      await zip.generateAsync({type: "uint8array"});
    } else {
      await zip.generateAsync({type: "string"});
    }

    // zip
    //   .generateNodeStream({type: 'nodebuffer', streamFiles: true})
    //   .pipe(createWriteStream(join(process.cwd(), 'foo.zip')))
    //   .on('finish', function () {
    //     console.log("out.zip written.");
    //   });

    const file = createReadStream(join(process.cwd(), 'out.zip'));
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="package.zip"',
    });
    console.log('DownloadController getFile: ',)
    return new StreamableFile(file)
  }

}
