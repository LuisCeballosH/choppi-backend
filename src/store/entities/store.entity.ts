import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Product } from '../../product/entities/product.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Store {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'Unique identifier for the store',
    uniqueItems: true,
    required: false,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Main Street Store',
    description: 'Name of the store',
    uniqueItems: true,
    required: true,
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ApiProperty({
    example: 'A store located on Main Street selling various products.',
    description: 'Description of the store',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @ApiHideProperty()
  @ManyToMany(() => Product, (product) => product.stores)
  products: Product[];

  @ApiProperty({
    example: '2024-06-01T12:00:00Z',
    description: 'The date and time when the store was created',
    required: false,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-10T15:30:00Z',
    description: 'The date and time when the store was last updated',
    required: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: null,
    description:
      'The date and time when the store was soft-deleted, null if not deleted',
    required: false,
  })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
