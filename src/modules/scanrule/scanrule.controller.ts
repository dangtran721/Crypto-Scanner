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
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

@UseGuards(AuthJwtGuard)
@ApiBearerAuth()
@Controller('scan-rules')
export class ScanruleController {
  constructor(private readonly scanruleService: ScanruleService) {}

  @Post()
  @ApiOperation({ summary: 'Create Scanrule ' })
  create(@Body() dto: CreateScanruleDto, @GetUser('id') userId: number) {
    return this.scanruleService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Scanrule ' })
  findAll(@GetUser('id') userId: number) {
    return this.scanruleService.findAll(userId);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOperation({ summary: 'Find one Scanrule ' })
  findOne(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.scanruleService.findOne(+id, userId);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOperation({ summary: 'Modify Scanrule ' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateScanruleDto,
    @GetUser('id') userId: number,
  ) {
    return this.scanruleService.update(+id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Del Scanrule ' })
  remove(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.scanruleService.remove(+id, userId);
  }
}
