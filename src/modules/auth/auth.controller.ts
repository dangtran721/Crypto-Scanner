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
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Token, type User } from '@prisma/client';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { RefreshToken } from '../token/dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.entity';
import { AuthJwtGuard } from './guards';
import { GetUser, Public } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthRegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthLoginDto): Promise<AuthResponseDto> {
    return this.authService.loginWithEmailAndPassword(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Body() dto: RefreshToken): Promise<Token> {
    return this.authService.logout(dto);
  }

  @Get('me')
  @UseGuards(AuthJwtGuard)
  getMe(@GetUser() user: User) {
    return user;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshToken) {
    return this.authService.refreshAuth(dto);
  }
}
