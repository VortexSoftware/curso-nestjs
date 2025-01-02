import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { awsConfig } from 'src/common/constants';

@Injectable()
export class AwsService {
  private s3Client: S3Client;
  private logger = new Logger(AwsService.name);

  constructor() {
    this.s3Client = new S3Client(awsConfig.client);
  }

  async uploadFile(file: Express.Multer.File) {
    const fileExtensionsByMimetype: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/tiff': 'tiff',
      'image/bmp': 'bmp',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'video/ogg': 'ogg',
      'video/x-msvideo': 'avi',
    };
    try {
      const { mimetype } = file;
      const extension = fileExtensionsByMimetype[mimetype] ?? 'file';
      const key = `${crypto.randomUUID()}.${extension}`;
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: awsConfig.s3.bucket,
          ContentType: mimetype,
          Key: key,
          Body: file.buffer,
        }),
      );
      return `https://${awsConfig.s3.bucket}.s3.${awsConfig.client.region}.amazonaws.com/${key}`;
    } catch (err) {
      this.logger.error(`Error uploading `, (err as Error).stack);
    }
  }
}
