import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateProfilePictureDto {
  @IsString()
  @IsNotEmpty()
  image: string;
}
