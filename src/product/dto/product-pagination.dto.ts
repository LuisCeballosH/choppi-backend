import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ProductPaginationDto {
  @ApiProperty({
    example: 1,
    description: 'Page number for pagination (default is 1)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    example: 10,
    description:
      'Number of items per page for pagination (default is 10, max is 100)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number;

  @ApiProperty({
    example: 'search text',
    description: 'Text to search for in the results',
    required: false,
  })
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiProperty({
    example: 'name',
    description: 'Field to sort the results by',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    example: 'ASC',
    description: 'Order to sort the results by (ASC or DESC)',
    required: false,
  })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';

  @ApiProperty({
    example: 'store-id-123',
    description: 'Filter products by store ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  storeId?: string;
}
