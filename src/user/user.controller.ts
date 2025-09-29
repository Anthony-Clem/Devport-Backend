import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorator/public.decorator';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: UserResponseDto) {
    return user;
  }

  @Public()
  @Get(':id')
  getUserPortfolio(@Param('id') userId: string) {
    return this.userService.getUserPortfoilio(userId);
  }
}
