import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { S3Service } from 'src/s3/s3.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, S3Service],
})
export class ProjectModule {}
