import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsEmail()
  email?: string;
  @MinLength(6)
  password?: string;
  @MinLength(3)
  name?: string;
  role?: Role = Role.USER;
}
