import {Injectable, Response, StreamableFile} from '@nestjs/common';
import {createReadStream} from "fs";
import {join} from "path";

@Injectable()
export class DownloadService {

  // getFile(@Response({passthrough: true}) res): StreamableFile {
  //   console.log('PhotosController getFile: ',)
  //   const file = createReadStream(join(process.cwd(), 'package.json'));
  //   res.set({
  //     'Content-Type': 'application/json',
  //     'Content-Disposition': 'attachment; filename="package.json"',
  //   });
  //   return new StreamableFile(file)
  // }

}
