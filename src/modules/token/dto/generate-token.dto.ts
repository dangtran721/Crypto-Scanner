import { TokenType } from '@prisma/client';
import { IsDate, IsEnum, IsInt } from 'class-validator';
import { Dayjs } from 'dayjs';

export class GenerateTokenDto {
  @IsInt()
  userId: number;

  @IsDate()
  expires: Date;

  @IsEnum(TokenType)
  tokenType: TokenType;
}
