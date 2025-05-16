import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /(image|video)\/.*/ })
      ]
    })
  ) files: Express.Multer.File[]) {

    const urls = await Promise.all(
      files.map(
        async file => await this.mediaService.upload(file.buffer)
      )
    )

    return {
      message: "files uploaded successfully",
      urls
    }
  }

  @Delete(':key')
  async deleteFile(@Param('key') fileKey: string) {
    return this.mediaService.deleteFile(fileKey);
  }

}