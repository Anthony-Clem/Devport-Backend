import { Body, Controller, Patch, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put()
  updateProfile(
    @GetUser() user: UserResponseDto,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(user, dto);
  }

  @Patch()
  updateProfilePicture(
    @GetUser('id') userId: string,
    @Body() dto: UpdateProfilePictureDto,
  ) {
    return this.profileService.updateProfilePicture(userId, dto);
  }
}
