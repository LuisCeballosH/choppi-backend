import { ApiProperty } from '@nestjs/swagger';
import { Store } from '../../store/entities/store.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Product {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'Unique identifier for the product',
    uniqueItems: true,
    required: false,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Choppi Product 1',
    description: 'Name of the product',
    uniqueItems: true,
    required: true,
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ApiProperty({
    example: 'A description for Choppi Product 1',
    description: 'Description of the product',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @ApiProperty({
    example: 100,
    description: 'Stock quantity of the product',
    required: true,
  })
  @Column({
    type: 'double precision',
    default: 0,
  })
  stock: number;

  @ApiProperty({
    type: [Store],
    description: 'Stores associated with the product',
    required: false,
  })
  @ManyToMany(() => Store, (store) => store.products, { eager: true })
  @JoinTable()
  stores: Store[];

  @ApiProperty({
    example: '2024-06-01T12:00:00Z',
    description: 'Timestamp when the product was created',
    required: false,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-10T15:30:00Z',
    description: 'Timestamp when the product was last updated',
    required: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: null,
    description: 'Timestamp when the product was soft-deleted',
    required: false,
  })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
