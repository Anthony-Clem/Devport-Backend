import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  jobTitle?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  bio?: string;
}
