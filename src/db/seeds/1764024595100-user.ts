import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

export class User1764024595100 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        email: 'luis@example.com',
        username: 'luis',
        password: bcrypt.hashSync(
          'abcd1234',
          Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10),
        ),
      },
    ]);
  }
}
