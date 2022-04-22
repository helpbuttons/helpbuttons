namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    DATABASE_URL: string;
    PORT: string;
    HOST: string;
    SWAGGER_PATH?: string;
  }
}
