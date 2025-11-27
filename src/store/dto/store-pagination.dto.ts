import { ApiProperty } from '@nestjs/swagger';
import { Store } from '../entities/store.entity';

export class PaginatedStoresDto {
  @ApiProperty({ description: 'Total number of stores available' })
  total: number;

  @ApiProperty({
    type: [Store],
    description: 'List of stores for the current page',
  })
  stores: Store[];
}
