import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async getProjects(userId: string) {
    return this.prisma.project.findMany({
      where: {
        userId,
      },
    });
  }

  async createProject(userId: string, dto: CreateProjectDto) {
    const { name, demoUrl, description, repositoryUrl, thumbnail } = dto;

    return this.prisma.project.create({
      data: {
        name,
        demoUrl,
        description,
        repositoryUrl,
        thumbnail,
        userId,
      },
    });
  }

  async updateProject(
    userId: string,
    projectId: string,
    dto: UpdateProjectDto,
  ) {
    const { name, demoUrl, description, repositoryUrl, thumbnail } = dto;

    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const data: Record<string, any> = {};

    if (name && name !== project.name) {
      data.name = name;
    }

    if (description && description !== project.description) {
      data.description = description;
    }

    if (repositoryUrl && repositoryUrl !== project.repositoryUrl) {
      data.repositoryUrl = repositoryUrl;
    }

    if (demoUrl && demoUrl !== project.demoUrl) {
      data.demoUrl = demoUrl;
    }

    if (thumbnail && thumbnail !== project.thumbnail) {
      const { fileUrl } = await this.s3.saveProjectThumbnailImage(
        thumbnail,
        userId,
        project.id,
      );
      data.thumbnail = fileUrl;
    }

    if (Object.keys(data).length === 0) {
      return project;
    }

    return this.prisma.project.update({
      where: {
        id: projectId,
        userId,
      },
      data,
    });
  }

  async deleteProject(userId: string, projectId: string) {
    const project = await this.prisma.project.delete({
      where: {
        userId,
        id: projectId,
      },
    });

    const { success } = await this.s3.deleteProjectThumbnail(project.thumbnail);

    if (!success) {
      throw new Error(`Failed to delete file ${project.thumbnail} from S3`);
    }

    return;
  }
}
