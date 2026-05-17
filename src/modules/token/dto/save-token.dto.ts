import { ApiProperty } from '@nestjs/swagger';
import { TokenType } from '@prisma/client';
import {
  IsString,
  IsInt,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class SaveTokenDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsDate()
  expires: Date;

  @ApiProperty({ enum: TokenType })
  @IsEnum(TokenType)
  type: TokenType;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  blacklisted?: boolean;
}
