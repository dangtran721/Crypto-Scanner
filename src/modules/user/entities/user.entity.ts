import { Exclude, Expose } from 'class-transformer';
import { Role } from '@prisma/client';
@Exclude()
export class Users {
  id: number;
  @Expose()
  email: string;

  @Expose()
  name: string | null;

  role: Role = Role.USER;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Users>) {
    Object.assign(this, partial);
  }
}
