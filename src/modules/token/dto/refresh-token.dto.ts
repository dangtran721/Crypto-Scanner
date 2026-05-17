import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshToken {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
