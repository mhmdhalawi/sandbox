import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UnauthorizedException,
  Session,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ISession } from 'src/types/session';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.users({});
  }

  @Get('me')
  getProfile(@Session() session: ISession) {
    const userId = session.user;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.userService.user({ id: userId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.user({ id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser({
      where: { id },
      data: updateUserDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser({
      id,
    });
  }
}
