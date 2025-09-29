import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  description: string;

  @IsUrl()
  demoUrl: string;

  @IsUrl()
  repositoryUrl: string;

  @IsString()
  @IsNotEmpty()
  thumbnail: string;
}
