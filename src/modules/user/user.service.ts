import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { encryptPassword } from 'src/utils/encryption';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ConflictException('User does not exist');
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
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: await encryptPassword(createUserDto.password),
        name: createUserDto.name,
        role: createUserDto.role,
      },
    });
    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.getUserById(+id);
    return await this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.name,
        password: updateUserDto.password,
        role: updateUserDto.role,
      },
    });
  }

  async remove(id: number): Promise<User> {
    const user = await this.getUserById(+id);
    await this.prisma.user.delete({ where: { id: user.id } });
    return user;
  }
}
