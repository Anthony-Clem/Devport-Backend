import { Exclude, Type } from 'class-transformer';

class ProfileDto {
  id: string;
  name: string | null;
  jobTitle: string | null;
  bio: string | null;
  profilePicture: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserResponseDto {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => ProfileDto)
  profile: ProfileDto;

  @Exclude()
  password: string;
}
