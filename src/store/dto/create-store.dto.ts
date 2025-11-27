import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    example: 'My Store',
    description: 'Name of the store',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A description of my store',
    description: 'Description of the store',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;
}
