import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PaginatedUsersDto } from './dto/user-pagination-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    type: PaginatedUsersDto,
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    type: User,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully soft-deleted.',
  })
  @Delete(':id')
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.softDelete(id);
  }
}
