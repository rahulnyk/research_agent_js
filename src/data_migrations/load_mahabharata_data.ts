import * as dotenv from "dotenv";
dotenv.config();

import { glob } from "glob";
import csvLoader from "../document_loaders/csv_loader.js";
import {
    TypeORMStore,
    DatabaseConnOptions,
} from "../vector_stores/type_orm_base.js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// This file is used to load the mahabharat data into the vector store database.
// Step 1: get a list of files to load
const dataDir = "/Users/rahulnayak/TechWork/AIProjects/mahabharata/data";
const files = await glob(`${dataDir}/*.csv`);
// Ignore these files because the are not the data files.
const ignoreFiles = ["summaries_combined.csv", "tiny_tales_glossary.csv"];
const dataFiles = files.filter((file) => {
    let fileName = file.split("/").pop() || "";
    return !ignoreFiles.includes(fileName);
});

// Step 2: load these files into Documents
const lcDocs = csvLoader(dataFiles);

// Step 3: Calculat eEmbeddings and save
const database_conn_options: DatabaseConnOptions = {
    username: process.env.SUPABASE_DBUSER,
    password: process.env.SUPABASE_PASSWORD,
    host: process.env.SUPABASE_URL,
    database: process.env.SUPABASE_DATABASE,
};

const embeddings = new OpenAIEmbeddings();
const typeORM = new TypeORMStore(embeddings, database_conn_options);
const store = await typeORM.store();

const recreate = false;
if (recreate) {
    await store.addDocuments(lcDocs);
} else {
    console.log('Not recreating the store, if you want to force recreate set recreate = true')
}
