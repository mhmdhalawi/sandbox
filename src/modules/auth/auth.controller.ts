import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(
    @Session() session: Record<string, any>,
    @Body() createUserDto: CreateUserDto,
  ) {
    const user = await this.authService.signup(createUserDto);
    session.user = user.id; // Store user ID in session
    return user;
  }

  @HttpCode(200)
  @Post()
  async login(
    @Session() session: Record<string, any>,
    @Body() credentials: LoginUserDto,
  ) {
    const currentUser = await this.authService.login(credentials);
    session.user = currentUser.id; // Store user ID in session
    return currentUser;
  }

  @Post('logout')
  async logout(@Session() session: Record<string, any>) {
    session.user = null; // Clear user session
    return { message: 'Logged out successfully' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('passport-login')
  async passportLogin(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('passport-profile')
  async passportProfile(@Request() req: any) {
    return req.user;
  }
}
