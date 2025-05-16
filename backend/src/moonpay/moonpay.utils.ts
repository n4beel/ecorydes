import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';    // Import the crypto module for cryptographic functions

@Injectable()
export class MoonpayUtils {
    constructor(
        private readonly configService: ConfigService
    ) { }

    generateSignature = (url) => {
        const secretKey = this.configService.get('moonpay.apiSecret');
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(new URL(url).search)
            .digest('base64');

        const urlWithSignature = `${url}&signature=${encodeURIComponent(signature)}`;
        const sig = signature
        console.log(sig)
        return sig
    };
}