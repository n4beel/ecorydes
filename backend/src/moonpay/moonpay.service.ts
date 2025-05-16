import { BadRequestException, Injectable } from '@nestjs/common';
import { MoonpayUtils } from './moonpay.utils';

@Injectable()
export class MoonpayService {

    constructor(
        private readonly monnpayUtils: MoonpayUtils,
    ) { }

    async signUrl(url: string): Promise<string> {
        if (!url) {
            throw new BadRequestException('URL is required');  // Check if the URL is provided
        }

        try {
            const signature = this.monnpayUtils.generateSignature(url);  // Generate the signature
            console.log("signature is " + signature);
            return signature;  // Return the generated signature
        } catch (error) {
            console.error('Error generating the signature:', error);  // Log any errors that occur during signing
            throw new BadRequestException('Error generating the signature');  // Throw an error if signing fails
        }
    }
}
