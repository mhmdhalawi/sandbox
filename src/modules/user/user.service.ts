import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateUser(sessionUserId: string, id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    const sessionUser = await this.prisma.user.findUnique({
      where: { id: sessionUserId },
    });

    if (sessionUserId !== id && !sessionUser.admin)
      throw new ForbiddenException('You can not update this user');

    return this.prisma.user.update({
      where: { id: sessionUserId },
      data,
    });
  }

  async deleteUser(sessionUserId: string, id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    const sessionUser = await this.prisma.user.findUnique({
      where: { id: sessionUserId },
    });

    if (sessionUserId !== id && !sessionUser.admin)
      throw new ForbiddenException('You can not delete this user');

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
