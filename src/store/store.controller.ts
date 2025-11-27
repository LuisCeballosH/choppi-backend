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
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Public } from 'src/auth/decorators/public/public.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { Store } from './entities/store.entity';
import { PaginatedStoresDto } from './dto/store-pagination.dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiResponse({
    status: 201,
    description: 'The store has been successfully created.',
    type: Store,
  })
  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @ApiResponse({
    status: 200,
    description: 'List of stores retrieved successfully.',
    type: PaginatedStoresDto,
  })
  @Public()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.storeService.findAll(paginationDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The store has been successfully retrieved.',
    type: Store,
  })
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'The store has been successfully updated.',
    type: Store,
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.update(id, updateStoreDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The store has been successfully soft-deleted.',
  })
  @Delete(':id')
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.softDelete(id);
  }
}
