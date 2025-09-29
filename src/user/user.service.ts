import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPortfoilio(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            name: true,
            jobTitle: true,
            bio: true,
            profilePicture: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
            description: true,
            demoUrl: true,
            repositoryUrl: true,
            thumbnail: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
