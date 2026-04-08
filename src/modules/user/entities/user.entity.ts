import { Exclude, Expose } from 'class-transformer';
import { Role } from '@prisma/client';
import type { AuthTokensResponseType } from 'src/common/types';

export class Users {
  id: number;
  email: string;
  name: string | null;
  token?: AuthTokensResponseType;

  @Exclude()
  role: Role = Role.USER;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<Users>) {
    Object.assign(this, partial);
  }
}
