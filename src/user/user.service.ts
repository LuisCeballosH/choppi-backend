import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
    @InjectDataSource()
    readonly dataSource: DataSource,
    readonly commonService: CommonService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = queryRunner.manager.create(User, {
        ...createUserDto,
        password: bcrypt.hashSync(
          createUserDto.password ?? 'abcd1234',
          Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10),
        ),
      });

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
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
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      queryBuilder.leftJoinAndSelect('user.products', 'product');

      if (searchText) {
        queryBuilder
          .where('user.email ILIKE :searchText', {
            searchText: `%${searchText}%`,
          })
          .orWhere('user.username ILIKE :searchText', {
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
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      queryRunner.manager.merge(User, user, updateUserDto);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return user;
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
      await queryRunner.manager.softDelete(User, id);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.commonService.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }
}
