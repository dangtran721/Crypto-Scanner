import { TokenType } from '@prisma/client';
import {
  IsString,
  IsInt,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateTokenDto {
  @IsString()
  token: string;

  @IsInt()
  userId: number;

  @IsDate()
  expires: Date;

  @IsEnum(TokenType)
  type: TokenType;

  @IsOptional()
  @IsBoolean()
  blacklisted?: boolean;
}
