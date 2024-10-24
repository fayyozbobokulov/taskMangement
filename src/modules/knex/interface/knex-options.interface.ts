export interface KnexModuleOptions {
  client: string;
  connection: {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
  };
  pool?: {
    min?: number;
    max?: number;
    idleTimeoutMillis?: number;
    acquireTimeoutMillis?: number;
  };
  debug?: boolean;
}
