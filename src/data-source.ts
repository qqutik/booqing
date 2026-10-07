import 'dotenv/config';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './config/database.config.js';

export default new DataSource({
  ...getDatabaseConfig(),
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
