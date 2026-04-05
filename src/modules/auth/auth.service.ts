import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { AuthRegisterDto, AuthLoginDto } from './dto';
import { encryptPassword, isPasswordMatch } from 'src/common/utils/encryption';
import { Users } from '../user/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(AuthRegisterDto: AuthRegisterDto): Promise<Users> {
    const user = await this.userService.createUser(AuthRegisterDto);
    return new Users(user);
  }

  async loginWithEmailAndPassword(AuthLoginDto: AuthLoginDto): Promise<Users> {
    const user = await this.userService.getUserByEmail(AuthLoginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    if (!(await isPasswordMatch(AuthLoginDto.password, user.password))) {
      throw new ConflictException('Password does not match');
    }
    return new Users(user);
  }
}
