import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
  @MinLength(3)
  name: string;
  role: Role = Role.USER;
}
