import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userName: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
