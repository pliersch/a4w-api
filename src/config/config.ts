import { ConnectionOptions } from 'typeorm';

export interface AppConfiguration {
  serverPort: number;
  redis?: {
    host: string,
    port: number,
    enabled: boolean | string,
  };
  database: ConnectionOptions;
}
