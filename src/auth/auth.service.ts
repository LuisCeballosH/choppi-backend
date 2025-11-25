import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/user/entities/user.entity';
import { CommonService } from 'src/common/common.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource()
    readonly dataSource: DataSource,
    readonly commonService: CommonService,
    readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { email: signInDto.email },
      });

      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      const isPasswordValid = bcrypt.compareSync(
        signInDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }
      const payload = { sub: user.id };
      const token = this.jwtService.sign(payload);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return { user: rest, token };
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.commonService.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }
}
