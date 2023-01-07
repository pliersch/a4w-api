import { Module } from '@nestjs/common';
import { DownloadController } from "./download.controller";

@Module({
  providers: [],
  controllers: [DownloadController]
})
export class DownloadModule {}
