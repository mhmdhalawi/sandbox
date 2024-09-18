import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(user: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
    return newUser;
  }

  async login(user: LoginUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true, email: true, password: true, name: true, age: true },
    });
    if (!existingUser) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    delete existingUser.password; // Remove password from the response
    return existingUser;
  }
}
