import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CommonModule } from 'src/common/common.module';
import { StoreModule } from 'src/store/store.module';

@Module({
  controllers: [ProductController],
  imports: [TypeOrmModule.forFeature([Product]), CommonModule, StoreModule],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
