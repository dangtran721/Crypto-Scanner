import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { Watchlist, WatchlistItem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddWatchlistItemDto } from './dto/add-watchlist-item.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client.js';
import { WatchlistResponseType } from './types/watchlist-response.type';
import { AddManyWatchlistItemsDto } from './dto/add-many-watchlist-items.dto';

@Injectable()
export class WatchlistsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWatchlistDto, userId: number): Promise<Watchlist> {
    return await this.prisma.watchlist.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: number): Promise<WatchlistResponseType[]> {
    const watchlists = await this.prisma.watchlist.findMany({
      where: { userId },
      include: { items: { select: { coinSymbol: true } } },
    });

    return watchlists.map((list) => ({
      id: list.id,
      name: list.name,
      itemCount: list.items.length,
      symbols: list.items.map((i) => i.coinSymbol),
    }));
  }

  async findOne(watchlistId: number, userId: number): Promise<Watchlist> {
    const watchlist = await this.prisma.watchlist.findFirst({
      where: { id: watchlistId, userId },
      include: { items: true },
    });

    if (!watchlist) {
      throw new NotFoundException(`Watchlist not found or access denied`);
    }

    return watchlist;
  }

  async update(
    id: number,
    dto: UpdateWatchlistDto,
    userId: number,
  ): Promise<Watchlist> {
    await this.findOne(id, userId);

    return await this.prisma.watchlist.update({
      where: { id },
      data: { ...dto },
    });
  }

  async delete(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.watchlist.delete({ where: { id } });
  }

  //Items:
  async addItem(
    watchlistId: number,
    dto: AddWatchlistItemDto,
    userId: number,
  ): Promise<WatchlistItem> {
    await this.findOne(watchlistId, userId);

    try {
      return await this.prisma.watchlistItem.create({
        data: {
          watchlistId,
          coinSymbol: dto.coinSymbol.toUpperCase(),
        },
      });
    } catch (error) {
      // catch duplicate case
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Symbol ${dto.coinSymbol} already exists in this watchlist`,
          );
        }
      }
      throw error;
    }
  }

  async addManyItems(
    watchlistId: number,
    dto: AddManyWatchlistItemsDto,
    userId: number,
  ): Promise<WatchlistItem[]> {
    await this.findOne(watchlistId, userId);

    const normalizedSymbols = dto.coinSymbol.map((symbol) =>
      symbol.toUpperCase(),
    );

    await this.prisma.watchlistItem.createMany({
      data: normalizedSymbols.map((symbol) => ({
        watchlistId,
        coinSymbol: symbol,
      })),
      skipDuplicates: true,
    });

    return this.prisma.watchlistItem.findMany({
      where: {
        watchlistId,
        coinSymbol: {
          in: normalizedSymbols,
        },
      },
    });
  }

  async removeItem(watchlistId: number, userId: number, itemId: number) {
    await this.findOne(watchlistId, userId);

    const deleteResult = await this.prisma.watchlistItem.deleteMany({
      where: { id: itemId, watchlistId },
    });

    if (deleteResult.count === 0) {
      throw new NotFoundException(`Item not found in this watchlist`);
    }
  }
}
