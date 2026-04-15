import { Injectable } from '@nestjs/common';
import { IIndicatorStrategy } from './interface.strategy';

@Injectable()
export class EmaStrategy implements IIndicatorStrategy {
  calculate(data: number[], config: any) {}
}
