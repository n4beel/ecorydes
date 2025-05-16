import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaUtils } from './media.utils';

@Module({
  controllers: [MediaController],
  providers: [MediaService, MediaUtils],
})
export class MediaModule { }
