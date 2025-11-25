import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString({ each: true })
  @IsArray()
  stores: string[];
}
