// import { AppConfiguration } from "./config";
// import path from "path";
//
// export default () => ({
//   serverPort: Number(process.env.SERVER_PORT) || 3000,
//   redis: {
//     host: process.env.REDIS_HOST || '127.0.0.1',
//     port: Number(process.env.REDIS_PORT) || 6379,
//     enabled: process.env.REDIS_ENABLED || false
//   },
//   database: {
//     type: 'postgres',
//     host: process.env.POSTGRES_HOST || 'localhost',
//     port: Number(process.env.POSTGRES_PORT) || 5432,
//     username: process.env.POSTGRES_USER || 'postgres',
//     password: process.env.POSTGRES_PASSWORD || 'Pinscher77',
//     database: process.env.POSTGRES_DB || 'a4w',
//     entities: [path.resolve(__dirname, '**/*.entity{.ts,.js}')],
//     synchronize: true,
//     replication: process.env.DB_MASTER_URL && process.env.DB_REPLICAS_URL ? {
//       master: {
//         url: process.env.DB_MASTER_URL,
//       },
//       slaves: process.env.DB_REPLICAS_URL ? [
//         {url: process.env.DB_REPLICAS_URL},
//       ] : [],
//     } : null,
//   },
// });

// export default () => ({
//   port: parseInt(process.env.PORT, 10) || 3000,
//   database: {
//     host: process.env.DATABASE_HOST,
//     port: parseInt(process.env.DATABASE_PORT, 10) || 5432
//   }
// });

import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
  host: 'host',
  port: 4000,
}));
