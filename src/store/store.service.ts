import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository, DataSource, In } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    readonly storeRepository: Repository<Store>,
    @InjectDataSource()
    readonly dataSource: DataSource,
    readonly commonService: CommonService,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const store = queryRunner.manager.create(Store, createStoreDto);

      await queryRunner.manager.save(store);

      await queryRunner.commitTransaction();
      return store;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.commonService.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, size, searchText, sortBy, order } = paginationDto;
    try {
      const queryBuilder = this.storeRepository.createQueryBuilder('store');

      if (searchText) {
        queryBuilder
          .where('store.name ILIKE :searchText', {
            searchText: `%${searchText}%`,
          })
          .orWhere('store.description ILIKE :searchText', {
            searchText: `%${searchText}%`,
          });
      }

      if (sortBy) {
        queryBuilder.orderBy(`store.${sortBy}`, order);
      } else {
        queryBuilder.orderBy('store.createdAt', 'DESC');
      }

      if (page && size) {
        queryBuilder.skip((page - 1) * size).take(size);
      }

      const [stores, total] = await queryBuilder.getManyAndCount();
      return { total, stores };
    } catch (error) {
      this.commonService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  findMany(ids: string[]) {
    return this.storeRepository.find({
      where: { id: In(ids) },
    });
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const store = await this.findOne(id);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      queryRunner.manager.merge(Store, store, updateStoreDto);
      await queryRunner.manager.save(store);
      await queryRunner.commitTransaction();
      return store;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.commonService.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async softDelete(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.softDelete(Store, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.commonService.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }
}
