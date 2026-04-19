import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
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
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateIndicatorDto,
    @GetUser('id') userId: number,
  ): Promise<Indicator> {
    return this.indicatorService.create(dto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@GetUser('id') userId: number): Promise<Indicator[]> {
    return this.indicatorService.findAll(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: string,
    @GetUser('id') userId: number,
  ): Promise<Indicator> {
    return this.indicatorService.findOne(+id, userId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateIndicatorDto: UpdateIndicatorDto,
    @GetUser('id') userId: number,
  ): Promise<Indicator> {
    return this.indicatorService.update(+id, updateIndicatorDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @GetUser('id') userId: number,
  ): Promise<void> {
    return this.indicatorService.remove(+id, userId);
  }
}
