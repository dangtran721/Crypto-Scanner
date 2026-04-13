import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { encryptPassword } from 'src/common/utils/encryption';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.getUserByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await encryptPassword(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.getUserById(+id);

    if (updateUserDto.password) {
      updateUserDto.password = await encryptPassword(updateUserDto.password);
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
    });
  }

  async remove(id: number): Promise<User> {
    const user = await this.getUserById(+id);

    await this.prisma.user.delete({ where: { id: user.id } });

    return user;
  }
}
