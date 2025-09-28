import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly config: ConfigService,
  ) {}

  async updateProfile(user: UserResponseDto, dto: UpdateProfileDto) {
    const { name, jobTitle, bio } = dto;
    return this.prisma.profile.update({
      where: { userId: user.id },
      data: {
        name: name || user.profile.name,
        jobTitle: jobTitle || user.profile.jobTitle,
        bio: bio || user.profile.bio,
      },
    });
  }

  async updateProfilePicture(userId: string, dto: UpdateProfilePictureDto) {
    const matches = dto.image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid image format');

    const mime = matches[1];
    const ext = mime.split('/')[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    const bucketName = this.config.get<string>('AWS_S3_BUCKET_NAME')!;
    const endpoint = this.config.get<string>('AWS_ENDPOINT_URL_S3')!;

    const key = `profilePictures/${userId}.${ext}`;

    await this.s3.s3Client.send(
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

    return this.prisma.profile.update({
      where: { userId },
      data: { profilePicture: fileUrl },
    });
  }
}
