import { Injectable } from '@nestjs/common';
import { CreateScannerDto } from './dto/create-scanner.dto';
import { UpdateScannerDto } from './dto/update-scanner.dto';

@Injectable()
export class ScannerService {
  create(createScannerDto: CreateScannerDto) {
    return 'This action adds a new scanner';
  }

  findAll() {
    return `This action returns all scanner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scanner`;
  }

  update(id: number, updateScannerDto: UpdateScannerDto) {
    return `This action updates a #${id} scanner`;
  }

  remove(id: number) {
    return `This action removes a #${id} scanner`;
  }
}
