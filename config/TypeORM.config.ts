import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import * as dotenv from 'dotenv';
// dotenv.config();
import { MemoEntity } from 'src/memo/memo.entity';
import User from 'src/user/user.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: parseInt(process.env.PORT),
  username: 'admin',
  password: '1234',
  database: 'memo',
  entities: [MemoEntity, User],
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
};
