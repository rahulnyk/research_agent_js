import { appConfig } from "../config/index.js";
import { TypeORMStore } from "./type_orm_base.js";
import { embeddingModel } from "../ai_models/index.js";

const tableName = 'torm_embeddings'
const typeORM = new TypeORMStore(tableName, embeddingModel, appConfig.databaseConnOptions);
export const store = await typeORM.store();