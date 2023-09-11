import * as dotenv from "dotenv";
dotenv.config();
import { createLocalConfig } from "./envs/local.js";
import { createDevConfig } from "./envs/dev.js";
// import { createProdConfig } from "./envs/prod.js";

export const appConfig = getConfig();

function getConfig() {
  switch (process.env.APP_ENV) {
    case "dev":
      return createDevConfig();
    case "local":
      return createLocalConfig();
    default:
      throw new Error(`Invalid APP_ENV "${process.env.APP_ENV}"`);
  }
}