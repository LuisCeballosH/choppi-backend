import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [StoreController],
  imports: [TypeOrmModule.forFeature([Store]), CommonModule],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
