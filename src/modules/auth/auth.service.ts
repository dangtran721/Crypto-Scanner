import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthRegisterDto, AuthLoginDto } from './dto';
import { isPasswordMatch } from 'src/common/utils/encryption';
import { Users } from '../user/entities/user.entity';
import { TokenService } from '../token/token.service';
import { RefreshToken } from '../token/dto/refresh-token.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Token } from '@prisma/client';
import { AuthTokensResponseType } from 'src/common/types';
import { AuthResponseDto } from './dto/auth-response.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private tokenService: TokenService,
    private prisma: PrismaService,
  ) {}

  async register(dto: AuthRegisterDto): Promise<AuthResponseDto> {
    const user = await this.userService.createUser(dto);
    const tokens = await this.tokenService.generateAuthTokens(user);

    return {
      user: new Users(user),
      token: tokens.access,
    };
  }

  async loginWithEmailAndPassword(dto: AuthLoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user || !(await isPasswordMatch(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.tokenService.generateAuthTokens(user);
    //  console.log(tokens.refresh);

    return {
      user: new Users(user),
      token: tokens.access,
    };
  }

  async logout(dto: RefreshToken): Promise<Token> {
    const token = await this.prisma.token.findFirst({
      where: { token: dto.refreshToken, blacklisted: false },
    });
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.prisma.token.update({
      where: { id: token.id },
      data: { blacklisted: true },
    });
  }

  async refreshAuth(dto: RefreshToken): Promise<AuthTokensResponseType> {
    try {
      const refreshToken = await this.prisma.token.findFirst({
        where: {
          token: dto.refreshToken,
          type: 'REFRESH',
          blacklisted: false,
        },
      });

      if (!refreshToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userService.getUserById(refreshToken.userId);

      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }

      await this.prisma.token.delete({ where: { id: refreshToken.id } });
      return await this.tokenService.generateAuthTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
