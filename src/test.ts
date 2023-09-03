import * as dotenv from "dotenv";
dotenv.config();

import { TypeORMStore, DatabaseConnOptions } from "./vector_stores/type_orm.js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// Step 1: Calculat eEmbeddings and save
const database_conn_options: DatabaseConnOptions = {
    username: process.env.SUPABASE_DBUSER,
    password: process.env.SUPABASE_PASSWORD,
    host: process.env.SUPABASE_URL,
    database: process.env.SUPABASE_DATABASE,
}

const embeddings = new OpenAIEmbeddings();
const typeORM = new TypeORMStore(embeddings, database_conn_options);
const store = await typeORM.store();

let res = await store.similaritySearch('Arjuna and KArna', 10)
console.log(res)