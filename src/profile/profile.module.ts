import { Module } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, S3Service],
})
export class ProfileModule {}
