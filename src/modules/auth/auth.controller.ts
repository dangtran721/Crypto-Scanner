import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { AuthLoginDto, AuthRegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() AuthRegisterDto: AuthRegisterDto): Promise<User> {
    return this.authService.register(AuthRegisterDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() AuthLoginDto: AuthLoginDto): Promise<User> {
    return this.authService.loginWithEmailAndPassword(AuthLoginDto);
  }

  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // (@Body() AuthLoginDto: AuthLoginDto): Promise<User> {
  //   return this.authService.loginWithEmailAndPassword(AuthLoginDto);
  // }
}
