import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';

@Injectable()
export class RoomsService {
    pusher: any;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.pusher = new Pusher({
            appId: this.configService.get('pusher.appId'),
            key: this.configService.get('pusher.key'),
            secret: this.configService.get('pusher.secret'),
            cluster: this.configService.get('pusher.cluster'),
            encrypted: true
        });
    }

    sendMessage(roomId: string, message: string, payload: any): void {
        this.pusher.trigger(roomId, message, payload);
    }
}
