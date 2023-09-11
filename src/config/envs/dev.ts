import { defineConfig } from "../define-config.js"

export function createDevConfig() {
  return defineConfig({
    openApiKey: process.env.OPENAI_API_KEY,
    databaseConnOptions: {
        host: process.env.SUPABASE_URL,
        port: 5432,
        username: process.env.SUPABASE_DBUSER,
        password: process.env.SUPABASE_PASSWORD,
        database: process.env.SUPABASE_DATABASE,
    }
  });
}
