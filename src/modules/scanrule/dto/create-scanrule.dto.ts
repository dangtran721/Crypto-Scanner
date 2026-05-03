import { IsObject } from 'class-validator';
import type { ScanCondition } from '../types';

export class CreateScanruleDto {
  @IsObject()
  logic: ScanCondition;
}
