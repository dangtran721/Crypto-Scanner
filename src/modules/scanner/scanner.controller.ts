import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { CreateScannerDto } from './dto/create-scanner.dto';
import { UpdateScannerDto } from './dto/update-scanner.dto';

@Controller('scanner')
export class ScannerController {
  constructor(private readonly scannerService: ScannerService) {}

  @Post()
  create(@Body() createScannerDto: CreateScannerDto) {
    return this.scannerService.create(createScannerDto);
  }

  @Get()
  findAll() {
    return this.scannerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scannerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScannerDto: UpdateScannerDto) {
    return this.scannerService.update(+id, updateScannerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scannerService.remove(+id);
  }
}
