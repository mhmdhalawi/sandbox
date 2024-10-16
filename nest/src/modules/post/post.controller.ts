import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { ISession } from 'src/types/session';
import { Public } from 'src/decorators/public';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Session() session: ISession, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(session.user, createPostDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Session() session: ISession,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(session.user, +id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Session() session: ISession, @Param('id') id: string) {
    await this.postService.remove(session.user, +id);

    return { message: 'Post deleted successfully' };
  }
}
