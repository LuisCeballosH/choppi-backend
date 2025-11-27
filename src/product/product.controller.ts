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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/auth/decorators/public/public.decorator';
import { ProductPaginationDto } from './dto/product-pagination.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { PaginatedProductsDto } from './dto/product-pagination-response.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully.',
    type: PaginatedProductsDto,
  })
  @Public()
  @Get()
  findAll(@Query() paginationDto: ProductPaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The product has been successfully retrieved.',
    type: Product,
  })
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: Product,
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The product has been successfully soft-deleted.',
  })
  @Delete(':id')
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.softDelete(id);
  }
}
