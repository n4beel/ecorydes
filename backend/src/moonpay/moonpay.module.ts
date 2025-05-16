import { Module } from '@nestjs/common';
import { MoonpayController } from './moonpay.controller';
import { MoonpayService } from './moonpay.service';
import { MoonpayUtils } from './moonpay.utils';

@Module({
  controllers: [MoonpayController],
  providers: [MoonpayService, MoonpayUtils]
})
export class MoonpayModule { }
