import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  public readonly s3Client: S3Client;

  constructor(private readonly config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }

  async saveProfilePicture(userId: string, image: string) {
    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid image format');

    const mime = matches[1];
    const ext = mime.split('/')[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    const bucketName = this.config.get<string>('AWS_S3_BUCKET_NAME')!;
    const endpoint = this.config.get<string>('AWS_ENDPOINT_URL_S3')!;

    const key = `profilePictures/${userId}.${ext}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: mime,
        ACL: 'public-read',
      }),
    );

    const bucketHost = endpoint.replace('https://', '');
    const fileUrl = `https://${bucketName}.${bucketHost}/${key}`;

    return { fileUrl };
  }

  async saveProjectThumbnailImage(
    image: string,
    userId: string,
    projectId: string,
  ) {
    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid image format');

    const mime = matches[1];
    const ext = mime.split('/')[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    const bucketName = this.config.get<string>('AWS_S3_BUCKET_NAME')!;
    const endpoint = this.config.get<string>('AWS_ENDPOINT_URL_S3')!;

    const key = `projectThumbnails/${projectId}/${userId}.${ext}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: mime,
        ACL: 'public-read',
      }),
    );

    const bucketHost = endpoint.replace('https://', '');
    const fileUrl = `https://${bucketName}.${bucketHost}/${key}`;

    return { fileUrl };
  }

  async deleteProjectThumbnail(fileUrl: string) {
    const bucketName = this.config.get<string>('AWS_S3_BUCKET_NAME')!;
    const endpoint = this.config.get<string>('AWS_ENDPOINT_URL_S3')!;

    const bucketHost = endpoint.replace('https://', '');
    const key = fileUrl.replace(`https://${bucketName}.${bucketHost}/`, '');

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );

    return { success: true };
  }
}
