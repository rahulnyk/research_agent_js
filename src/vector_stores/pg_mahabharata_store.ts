
// Dont use. The PG Vector support of langchain is basically useless. 

import { appConfig } from "../config/index.js";
import { PGVStoreBase } from "./pgvector_base.js";
import { embeddingModel } from "../ai_models/index.js";

const tableName = 'mahabharata_embeddings'
const PGVStore = new PGVStoreBase(tableName, embeddingModel, appConfig.databaseConnOptions);
export const store = await PGVStore.store();