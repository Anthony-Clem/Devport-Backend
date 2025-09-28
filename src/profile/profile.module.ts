import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService, S3Service],
})
export class ProfileModule {}
