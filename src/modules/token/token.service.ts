import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTokenDto } from './dto';
import { Token } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async generateToken(userId: number): Promise<string> {
    return await this.jwtService.signAsync({ sub: userId });
  }
  async saveToken(CreateTokenDto: CreateTokenDto): Promise<Token> {
    return await this.prisma.token.create({ data: CreateTokenDto });
  }
  //async generateAuthToken();
}
