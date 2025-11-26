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
      const sanitized = { ...user } as Partial<User>;
      delete sanitized.password;
      return sanitized;
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
        queryBuilder.orderBy(`user.${sortBy}`, order);
      } else {
        queryBuilder.orderBy('user.createdAt', 'DESC');
      }

      if (page && size) {
        queryBuilder.skip((page - 1) * size).take(size);
      }

      const [users, total] = await queryBuilder.getManyAndCount();
      // remove password from each user before returning
      for (const u of users) {
        // delete the password property so it's not exposed in the response
        delete (u as Partial<User>).password;
      }

      return { total, users };
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
      const data = { ...(updateUserDto as Partial<UpdateUserDto>) };
      delete (data as Partial<UpdateUserDto>).password;
      queryRunner.manager.merge(User, user, data);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      const sanitized = { ...user } as Partial<User>;
      delete sanitized.password;
      return sanitized;
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
