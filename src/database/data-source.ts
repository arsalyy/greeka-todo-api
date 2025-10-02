import { DataSource } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [Task],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
