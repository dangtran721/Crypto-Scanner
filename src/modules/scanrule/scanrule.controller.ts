import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ScanruleService } from './scanrule.service';
import { CreateScanruleDto } from './dto/create-scanrule.dto';
import { UpdateScanruleDto } from './dto/update-scanrule.dto';
import { GetUser } from 'src/common/decorators';
import { AuthJwtGuard } from '../auth/guards';

@UseGuards(AuthJwtGuard)
@Controller('scan-rules')
export class ScanruleController {
  constructor(private readonly scanruleService: ScanruleService) {}

  @Post()
  create(@Body() dto: CreateScanruleDto, @GetUser('id') userId: number) {
    return this.scanruleService.create(dto, userId);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.scanruleService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.scanruleService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateScanruleDto,
    @GetUser('id') userId: number,
  ) {
    return this.scanruleService.update(+id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.scanruleService.remove(+id, userId);
  }
}
