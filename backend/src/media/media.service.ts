import { v2 as cloudinary } from 'cloudinary'
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaUtils } from './media.utils';
const path = require('path');

@Injectable()
export class MediaService {
    constructor(
        private readonly configService: ConfigService,
        private readonly mediaUtils: MediaUtils,
    ) {
        cloudinary.config({
            cloud_name: this.configService.getOrThrow('cloudinary.cloudName'),
            api_key: this.configService.getOrThrow('cloudinary.apiKey'),
            api_secret: this.configService.getOrThrow('cloudinary.apiSecret')
        });
    }

    async upload(file: Buffer) {
        const uploadedFileName = new Date().getTime().toString() + this.mediaUtils.generateRandomNumber()
        const { Readable } = require('stream');
        const readableStream = new Readable();
        readableStream.push(file);
        readableStream.push(null); // Signal the end of the stream

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                public_id: uploadedFileName,
                folder: 'EcoRide',
                overwrite: true,
                invalidate: true
            }, (error, result) => {
                if (error) {
                    console.error('Error uploading file:', error);
                    reject(new Error('File upload failed'));
                } else {
                    resolve(result?.secure_url);
                }
            });

            readableStream.pipe(uploadStream);
        });
    }

    async deleteFile(fileKey: string): Promise<{ message: string }> {
        // const command = new DeleteObjectCommand({
        //     Bucket: this.configService.get<string>('aws.s3BucketName'),
        //     Key: fileKey,
        // });

        try {
            // await this.s3Client.send(command);
            return { message: 'File deleted successfully.' };
        } catch (error) {
            return { message: 'File deletion failed.' };
        }
    }
}