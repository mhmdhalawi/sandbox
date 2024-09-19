import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(user: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
    const payload = { sub: newUser.id, name: newUser.name };
    return {
      access_token: this.jwtService.sign(payload),
      ...newUser,
    };
  }

  async login(user: LoginUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true, email: true, password: true, name: true, age: true },
    });
    if (!existingUser) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    delete existingUser.password; // Remove password from the response

    const payload = { sub: existingUser.id, name: existingUser.name };

    return {
      access_token: this.jwtService.sign(payload),
      ...existingUser,
    };
  }
}
