import { User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  email: string;
  name: string | null;
  age: number | null;
}
