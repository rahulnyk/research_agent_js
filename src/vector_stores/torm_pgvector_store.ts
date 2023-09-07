import * as dotenv from "dotenv";
dotenv.config();

import { TypeORMStore, DatabaseConnOptions } from "./type_orm_base.js";
import { embeddingModel } from "../ai_models/openAi.js";

const database_conn_options: DatabaseConnOptions = {
    host: 'localhost',
    port: 5432,
    username: process.env.PGVECTOR_DBUSER,
    password: process.env.PGVECTOR_PASSWORD,
    database: process.env.PGVECTOR_DATABASE,
};

const typeORM = new TypeORMStore(embeddingModel, database_conn_options);
const store = await typeORM.store();
export default store;
