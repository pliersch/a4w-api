import { Message } from "@modules/chat/message.entity";
import { Photo } from "@modules/photos/entites/photo.entity";
import { TagGroup } from "@modules/tags/entities/tag-group.entity";
import { Tag } from "@modules/tags/entities/tag.entity";
import { User } from "@modules/users/entities/user.entity";
import { DataSource } from "typeorm"

export async function getPostgresDataSource(): Promise<DataSource> {
  const PostgresDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Pinscher',
    database: 'a4w',
    entities: [User, Photo, Tag, TagGroup, Message]
    // todo re-enable (doesn't works)
    // entities: [__dirname + '**/*.entity{.ts,.js}'],
  })

  return PostgresDataSource.initialize();
}
