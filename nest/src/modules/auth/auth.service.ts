import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/modules/prisma/prisma.service';
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
    // Remove admin status from the response
    // delete newUser.admin;
    return {
      access_token: this.jwtService.sign(payload),
      ...newUser,
    };
  }

  async login(user: LoginUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Remove password from the response
    // delete existingUser.password;

    const payload = { sub: existingUser.id, name: existingUser.name };

    return {
      access_token: this.jwtService.sign(payload),
      ...existingUser,
    };
  }
}
