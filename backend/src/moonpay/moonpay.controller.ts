import { Controller, Get, Query } from '@nestjs/common';
import { MoonpayService } from './moonpay.service';

@Controller('moonpay')
export class MoonpayController {

    constructor(
        private readonly moonpayService: MoonpayService
    ) { }

    @Get('sign-url')
    async signUrl(@Query('url') url: string) {
        return await this.moonpayService.signUrl(url);
    }
}
