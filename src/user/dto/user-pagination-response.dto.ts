import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class PaginatedUsersDto {
  @ApiProperty({ description: 'Total number of users available' })
  total: number;

  @ApiProperty({
    type: [User],
    description: 'List of users for the current page',
  })
  users: User[];
}
