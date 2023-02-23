import { Message } from "@modules/chat/message.entity";
import { Photo } from "@modules/photos/entites/photo.entity";
import { TagGroup } from "@modules/tags/entities/tag-group.entity";
import { Tag } from "@modules/tags/entities/tag.entity";
import { User } from "@modules/users/entities/user.entity";
import { AppConfiguration } from "./config/config";

export const config: AppConfiguration = {
  serverPort: Number(process.env.SERVER_PORT) || 3000,
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    enabled: process.env.REDIS_ENABLED || false
  },
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'Pinscher',
    database: process.env.POSTGRES_DB || 'a4w',
    entities: [User, Photo, Tag, TagGroup, Message],
    // todo re-enable (doesn't works) since package updates
    // entities: [path.resolve(__dirname, '**/*.entity{.ts,.js}')],
    synchronize: true,
    replication: process.env.DB_MASTER_URL && process.env.DB_REPLICAS_URL ? {
      master: {
        url: process.env.DB_MASTER_URL,
      },
      slaves: process.env.DB_REPLICAS_URL ? [
        {url: process.env.DB_REPLICAS_URL},
      ] : [],
    } : null,
  },
};
