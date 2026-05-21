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
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AddManyWatchlistItemsDto } from './dto/add-many-watchlist-items.dto';

@UseGuards(AuthJwtGuard)
@ApiBearerAuth()
@Controller('watchlists')
export class WatchlistsController {
  constructor(private readonly watchlistsService: WatchlistsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Watchlist' })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateWatchlistDto,
    @GetUser('id') userId: number,
  ): Promise<Watchlist> {
    return this.watchlistsService.create(dto, userId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Show all my Watchlist' })
  findAll(@GetUser('id') userId: number) {
    return this.watchlistsService.findAll(userId);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOperation({ summary: 'Find one Watchlist' })
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') watchlistId: string,
    @GetUser('id') userId: number,
  ): Promise<Watchlist> {
    return this.watchlistsService.findOne(+watchlistId, userId);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOperation({ summary: 'Modify my Watchlist' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') watchlistId: string,
    @Body() dto: UpdateWatchlistDto,
    @GetUser('id') userId: number,
  ): Promise<Watchlist> {
    return this.watchlistsService.update(+watchlistId, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Del Watchlist' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.watchlistsService.delete(+id, userId);
  }

  // Items:
  @Post(':id/item')
  @ApiOperation({ summary: 'Add item to Watchlist' })
  @HttpCode(HttpStatus.CREATED)
  addItem(
    @Param('id') id: string,
    @Body() dto: AddWatchlistItemDto,
    @GetUser('id') userId: number,
  ): Promise<WatchlistItem> {
    return this.watchlistsService.addItem(+id, dto, userId);
  }

  @Post(':id/items/bulk')
  @ApiOperation({ summary: 'Add many items to Watchlist' })
  @HttpCode(HttpStatus.CREATED)
  addManyItems(
    @Param('id') id: string,
    @Body() dto: AddManyWatchlistItemsDto,
    @GetUser('id') userId: number,
  ): Promise<WatchlistItem[]> {
    return this.watchlistsService.addManyItems(+id, dto, userId);
  }

  @Delete(':id/items/:itemId')
  @ApiOperation({ summary: 'Del item in Watchlist' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @GetUser('id') userId: number,
  ) {
    return this.watchlistsService.removeItem(+id, userId, +itemId);
  }
}
