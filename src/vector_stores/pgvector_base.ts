import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PGVectorStore } from "langchain/vectorstores/pgvector";
// @ts-ignore
import {PoolConfig} from "pg"
import { appConfig } from "../config/index.js";
import { embeddingModel } from "../ai_models/index.js";
import { Embeddings } from "langchain/embeddings/base";
import { DatabaseConnOptions } from "../config/types.js";


export class PGVStoreBase {
  type = "postgres";
  embeddings: Embeddings;
  config: any;

  constructor (
    tableName: string,
    embeddings: Embeddings,
    dbOptions: DatabaseConnOptions,
  ) {
    this.embeddings = embeddings;
    this.config = {
      postgresConnectionOptions: {
        type: this.type,
        ...dbOptions,
      } as PoolConfig,
      tableName: tableName,
      columns: {
        idColumnName: "id",
        vectorColumnName: "vecctor",
        contentColumnName: "pagecontent",
        metadataColumnName: "metadata",
      },
    };
  }

  async store() {
    const pgvectorStore = await PGVectorStore.initialize(
      this.embeddings,
      this.config,
    );
    return pgvectorStore;
  }
}
