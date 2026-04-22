import { PartialType } from '@nestjs/mapped-types';
import { CreateScanruleDto } from './create-scanrule.dto';

export class UpdateScanruleDto extends PartialType(CreateScanruleDto) {}
