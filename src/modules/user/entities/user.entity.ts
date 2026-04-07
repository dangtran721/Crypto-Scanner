import { Exclude, Expose } from 'class-transformer';
import { Role } from '@prisma/client';
import type { AuthTokensResponse } from 'src/common/types';

export class Users {
  id: number;
  email: string;
  name: string | null;
  token?: AuthTokensResponse;

  @Exclude()
  role: Role = Role.USER;

  @Exclude()
  password: string;

  constructor(partial: Partial<Users>) {
    Object.assign(this, partial);
  }
}
