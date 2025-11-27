import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'Unique identifier for the user',
    uniqueItems: true,
    required: false,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
    uniqueItems: true,
    required: true,
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({
    example: 'username123',
    description: 'Username of the user',
    uniqueItems: true,
    required: true,
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({
    example: '2024-06-01T12:00:00Z',
    description: 'The date and time when the user was created',
    required: false,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-01T12:00:00Z',
    description: 'The date and time when the user was last updated',
    required: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: null,
    description: 'The date and time when the user was deleted',
    required: false,
  })
  @DeleteDateColumn()
  deletedAt: Date | null;
}
