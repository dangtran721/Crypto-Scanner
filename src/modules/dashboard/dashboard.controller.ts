import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthJwtGuard } from '../auth/guards';
import { GetUser } from 'src/common/decorators';
import { DashBoardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@UseGuards(AuthJwtGuard)
@ApiBearerAuth()
@Controller('dash-board')
export class DashBoardController {
  constructor(private readonly dashBoardService: DashBoardService) {}

  @Get('me')
  @ApiOperation({ summary: 'Show my whole things created' })
  getUserDashBoard(@GetUser('id') userId: number) {
    return this.dashBoardService.getUserDashBoard(userId);
  }
}
