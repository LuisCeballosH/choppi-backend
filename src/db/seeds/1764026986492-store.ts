import { Store } from 'src/store/entities/store.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class Store1764026986492 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Store);
    await repository.insert([
      {
        name: 'Choppi Main Store',
        description: 'The main store of Choppi',
      },
      {
        name: 'Choppi Outlet',
        description: 'The outlet store of Choppi',
      },
    ]);
  }
}
