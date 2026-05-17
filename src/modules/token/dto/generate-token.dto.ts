import { ApiProperty } from '@nestjs/swagger';
import { TokenType } from '@prisma/client';
import { IsDate, IsEnum, IsInt } from 'class-validator';

export class GenerateTokenDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsDate()
  expires: Date;

  @ApiProperty({ enum: TokenType })
  @IsEnum(TokenType)
  tokenType: TokenType;
}
