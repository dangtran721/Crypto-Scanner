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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@UseGuards(AuthJwtGuard)
@ApiBearerAuth()
@Controller('indicator')
export class IndicatorController {
  constructor(private readonly indicatorService: IndicatorService) {}

  @Post()
  @ApiOperation({ summary: 'Create Indicator parameter' })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateIndicatorDto,
    @GetUser('id') userId: number,
  ): Promise<Indicator> {
    return this.indicatorService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Find all my Indicator ' })
  @HttpCode(HttpStatus.OK)
  findAll(@GetUser('id') userId: number): Promise<Indicator[]> {
    return this.indicatorService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one my Indicator ' })
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: string,
    @GetUser('id') userId: number,
  ): Promise<Indicator> {
    return this.indicatorService.findOne(+id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modify Indicator ' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateIndicatorDto: UpdateIndicatorDto,
    @GetUser('id') userId: number,
  ): Promise<Indicator> {
    return this.indicatorService.update(+id, updateIndicatorDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Del Indicator ' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @GetUser('id') userId: number,
  ): Promise<void> {
    return this.indicatorService.remove(+id, userId);
  }
}
