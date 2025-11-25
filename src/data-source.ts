import 'dotenv/config';
import { DataSource } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';
import type { DataSourceOptions } from 'typeorm/browser';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number.parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
  synchronize: false,
  seeds: [__dirname + '/db/seeds/**/*{.ts,.js}'],
  seedTracking: false,
};

export const AppDataSource = new DataSource(options);
