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
import { WatchlistsService } from './watchlists.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { GetUser } from 'src/common/decorators';
import { Watchlist, WatchlistItem } from '@prisma/client';
import { AuthJwtGuard } from '../auth/guards';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { AddWatchlistItemDto } from './dto/add-watchlist-item.dto';

@UseGuards(AuthJwtGuard)
@Controller('watchlists')
export class WatchlistsController {
  constructor(private readonly watchlistsService: WatchlistsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateWatchlistDto,
    @GetUser('id') userId: number,
  ): Promise<Watchlist> {
    return this.watchlistsService.create(dto, userId);
  }

  @Get('me')
  findAll(@GetUser('id') userId: number) {
    return this.watchlistsService.findAll(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') watchlistId: string,
    @GetUser('id') userId: number,
  ): Promise<Watchlist> {
    return this.watchlistsService.findOne(+watchlistId, userId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') watchlistId: string,
    @Body() dto: UpdateWatchlistDto,
    @GetUser('id') userId: number,
  ): Promise<Watchlist> {
    return this.watchlistsService.update(+watchlistId, dto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.watchlistsService.delete(+id, userId);
  }

  // Items:
  @Post(':id/items')
  @HttpCode(HttpStatus.CREATED)
  addItem(
    @Param('id') id: string,
    @Body() dto: AddWatchlistItemDto,
    @GetUser('id') userId: number,
  ): Promise<WatchlistItem> {
    return this.watchlistsService.addItem(+id, dto, userId);
  }

  @Delete(':id/items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @GetUser('id') userId: number,
  ) {
    return this.watchlistsService.removeItem(+id, userId, +itemId);
  }
}
