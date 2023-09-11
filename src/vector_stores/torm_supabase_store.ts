import * as dotenv from "dotenv";
dotenv.config();

import { TypeORMStore, DatabaseConnOptions } from "./type_orm_base.js";
import { embeddingModel } from "../ai_models/openAIChat.js";

const database_conn_options: DatabaseConnOptions = {
    host: process.env.SUPABASE_URL,
    port: 5432,
    username: process.env.SUPABASE_DBUSER,
    password: process.env.SUPABASE_PASSWORD,
    database: process.env.SUPABASE_DATABASE,
};

const typeORM = new TypeORMStore(embeddingModel, database_conn_options);
const store = await typeORM.store();
export default store;