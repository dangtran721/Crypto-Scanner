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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from '@prisma/client';
import { GetUser, Public, Roles } from 'src/common/decorators';
import { AuthJwtGuard, RolesGuard } from '../auth/guards';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@UseGuards(AuthJwtGuard, RolesGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all User' })
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one User' })
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.getUserById(+id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update User' })
  @HttpCode(HttpStatus.OK)
  update(
    @GetUser('id') userId: number,
    @Body()
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete User' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@GetUser('id') userId: number): Promise<User> {
    return this.userService.remove(userId);
  }
}
