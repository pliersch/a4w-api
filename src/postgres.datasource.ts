import { DataSource } from "typeorm"
import path from "path";
import { User } from "@modules/users/entities/user.entity";
import { Photo } from "@modules/photos/entites/photo.entity";
import { config } from "./config";
import { Test } from "@modules/test/test.entity";
import { Tag } from "@modules/tags/entities/tag.entity";
import { TagGroup } from "@modules/tags/entities/tag-group.entity";

export async function getPostgresDataSource(): Promise<DataSource> {
  const PostgresDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Pinscher77',
    database: 'a4w',
    entities: [Test, User, Photo, Tag, TagGroup]
    // entities: [__dirname + '**/*.entity{.ts,.js}'],
  })

  return PostgresDataSource.initialize();
}

export function getDataSource(): DataSource {
  const PostgresDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Pinscher77',
    database: 'a4w',
    entities: [__dirname + '**/*.entity{.ts,.js}'],
  })

  PostgresDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!")
  })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err)
    });
  return PostgresDataSource;
}
