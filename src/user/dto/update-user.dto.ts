import { PartialType } from '@nestjs/mapped-types';

import { UserDto } from './user.dto';

//  Use PartialType from to make all fields optional for the update.
export class UpdateUserDto extends PartialType(UserDto) {}
