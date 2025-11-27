import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class PaginatedProductsDto {
  @ApiProperty({ description: 'Total number of products available' })
  total: number;

  @ApiProperty({
    type: [Product],
    description: 'List of products for the current page',
  })
  products: Product[];
}
