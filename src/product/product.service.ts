import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { DataSource, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { StoreService } from 'src/store/store.service';
import { ProductPaginationDto } from './dto/product-pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    readonly productRepository: Repository<Product>,
    @InjectDataSource()
    readonly dataSource: DataSource,
    readonly commonService: CommonService,
    readonly storeService: StoreService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const stores = await this.storeService.findMany(
        createProductDto.storeIds,
      );
      const product = queryRunner.manager.create(Product, {
        ...createProductDto,
        stores,
      });

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.commonService.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: ProductPaginationDto) {
    const { page, size, searchText, sortBy, order, storeId } = paginationDto;
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('product');

      if (searchText) {
        queryBuilder
          .where('product.name ILIKE :searchText', {
            searchText: `%${searchText}%`,
          })
          .orWhere('product.description ILIKE :searchText', {
            searchText: `%${searchText}%`,
          });
      }

      if (storeId) {
        queryBuilder
          .innerJoin('product.stores', 'store')
          .andWhere('store.id = :storeId', { storeId });
      }

      if (sortBy) {
        queryBuilder.orderBy(`product.${sortBy}`, order);
      } else {
        queryBuilder.orderBy('product.createdAt', 'DESC');
      }

      if (page && size) {
        queryBuilder.skip((page - 1) * size).take(size);
      }

      const [products, total] = await queryBuilder.getManyAndCount();
      return { total, products };
    } catch (error) {
      this.commonService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  findMany(ids: string[]) {
    return this.productRepository.find({
      where: { id: In(ids) },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      queryRunner.manager.merge(Product, product, {
        ...updateProductDto,
        stores: [],
      });
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      return product;
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
      await queryRunner.manager.softDelete(Product, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.commonService.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }
}
