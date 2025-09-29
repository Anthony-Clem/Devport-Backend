import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
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
    const { fileUrl } = await this.s3.saveProfilePicture(userId, dto.image);

    return this.prisma.profile.update({
      where: { userId },
      data: { profilePicture: fileUrl },
    });
  }
}
