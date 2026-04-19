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
import { IndicatorService } from './indicator.service';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { AuthJwtGuard } from '../auth/guards';
import { GetUser } from 'src/common/decorators';
import { Indicator } from '@prisma/client';

@UseGuards(AuthJwtGuard)
@Controller('indicator')
export class IndicatorController {
  constructor(private readonly indicatorService: IndicatorService) {}

  @Post()
  create(
    @Body() dto: CreateIndicatorDto,
    @GetUser('id') userId: number,
  ): Promise<Indicator> {
    return this.indicatorService.create(dto, userId);
  }

  @Get()
  findAll(@GetUser('id') userId: number): Promise<Indicator[]> {
    return this.indicatorService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetUser('id') userId: number,
  ): Promise<Indicator> {
    return this.indicatorService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIndicatorDto: UpdateIndicatorDto,
    @GetUser('id') userId: number,
  ): Promise<Indicator> {
    return this.indicatorService.update(+id, updateIndicatorDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser('id') userId: number,
  ): Promise<void> {
    return this.indicatorService.remove(+id, userId);
  }
}
