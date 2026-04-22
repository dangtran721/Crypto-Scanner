import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class CreateScanruleDto {
  @IsObject()
  logic: any;
}
