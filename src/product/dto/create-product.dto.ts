import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Product Name',
    description: 'Name of the product',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A description of the product',
    description: 'Description of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: ['store-id-123', 'store-id-456'],
    description: 'List of store IDs where the product is available',
    required: true,
  })
  @IsString({ each: true })
  @IsArray()
  storeIds: string[];
}
