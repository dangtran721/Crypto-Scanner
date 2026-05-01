import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDashBoard } from './entities/dashboard.entity';

@Injectable()
export class DashBoardService {
  constructor(private prisma: PrismaService) {}

  async getUserDashBoard(userId: number): Promise<UserDashBoard> {
    const dashBoard = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        watchlists: { include: { items: true } },
        scanRules: true,
        scanJobs: { include: { scanRuns: { include: { results: true } } } },
      },
    });

    if (!dashBoard) {
      throw new NotFoundException('User not found');
    }

    return new UserDashBoard(dashBoard);
  }
}
