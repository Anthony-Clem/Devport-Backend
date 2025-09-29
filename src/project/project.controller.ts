import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getProjects(@GetUser('id') userId: string) {
    return this.projectService.getProjects(userId);
  }

  @Post()
  createProject(@GetUser('id') userId: string, @Body() dto: CreateProjectDto) {
    return this.projectService.createProject(userId, dto);
  }

  @Put(':id')
  updateProject(
    @GetUser('id') userId: string,
    @Param('id') projectId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.projectService.updateProject(userId, projectId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProject(@GetUser('id') userId: string, @Param('id') projectId: string) {
    return this.projectService.deleteProject(userId, projectId);
  }
}
