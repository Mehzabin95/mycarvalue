import { IsEmail, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  adminName: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
