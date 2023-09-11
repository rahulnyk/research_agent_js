import { defineConfig } from "../define-config.js"

export function createLocalConfig() {
  return defineConfig({
    openApiKey: process.env.OPENAI_API_KEY,
    databaseConnOptions: {
        host: 'localhost',
        port: 5432,
        username: process.env.PGVECTOR_DBUSER,
        password: process.env.PGVECTOR_PASSWORD,
        database: process.env.PGVECTOR_DATABASE,
    }
  });
}
