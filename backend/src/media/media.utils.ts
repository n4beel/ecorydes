import { Injectable } from "@nestjs/common";

@Injectable()
export class MediaUtils {
    generateRandomNumber() {
        const min = 1000000000;
        const max = 9999999999;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}