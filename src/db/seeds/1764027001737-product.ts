import { Product } from 'src/product/entities/product.entity';
import { Store } from 'src/store/entities/store.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class Product1764027001737 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Product);
    const storeRepository = dataSource.getRepository(Store);

    const stores = await storeRepository.find();

    const products = Array.from({ length: 20 }).map((_, i) => {
      const id = i + 1;
      const assignedStores = stores.length ? [stores[i % stores.length]] : [];

      return {
        name: `Choppi Product ${id}`,
        description: `Description for Choppi Product ${id}`,
        stores: assignedStores,
      };
    });
    await repository.save(products);
  }
}
