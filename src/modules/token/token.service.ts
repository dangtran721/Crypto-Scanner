import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaveTokenDto } from './dto';
import { Token, TokenType } from '@prisma/client';
import { jwtUser } from 'src/common/types';
import dayjs from 'dayjs';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { ConfigService } from '@nestjs/config';
import { AllTypeConfig } from 'src/common/config/config.type';
import { AuthTokensResponseType } from '../auth/types/auth-token-response.type';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService<AllTypeConfig>,
  ) {}
  async generateToken(dto: GenerateTokenDto): Promise<string> {
    const payload = {
      sub: dto.userId,
      type: dto.tokenType,
    };
    return await this.jwtService.signAsync(payload, {
      expiresIn: dayjs(dto.expires).diff(dayjs(), 'second'),
    });
  }
  async saveToken(dto: SaveTokenDto): Promise<Token> {
    return await this.prisma.token.create({ data: dto });
  }
  async generateAuthTokens({ id }: jwtUser): Promise<AuthTokensResponseType> {
    const accessTokenExpires = dayjs()
      .add(
        this.configService.getOrThrow('auth.expires', { infer: true }),
        'minute',
      )
      .toDate();
    const accessToken = await this.generateToken({
      userId: id,
      expires: accessTokenExpires,
      tokenType: TokenType.ACCESS,
    });

    const refreshTokenExpires = dayjs()
      .add(
        this.configService.getOrThrow('auth.refreshExpires', { infer: true }),
        'day',
      )
      .toDate();
    const refreshToken = await this.generateToken({
      userId: id,
      expires: refreshTokenExpires,
      tokenType: TokenType.REFRESH,
    });

    await this.saveToken({
      token: refreshToken,
      userId: id,
      expires: refreshTokenExpires,
      type: TokenType.REFRESH,
    });
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires,
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires,
      },
    };
  }
}
