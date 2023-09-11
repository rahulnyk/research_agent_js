import { DataSourceOptions } from "typeorm";
import {
    TypeORMVectorStore,
    TypeORMVectorStoreArgs,
} from "langchain/vectorstores/typeorm";
import { Embeddings } from "langchain/embeddings";
import { DatabaseConnOptions } from "../config/types.js";

class TypeORMStore {
    /**
     * This is just a thin wrapper over the type orm store
     * The table schema for embedding table
     * id: uuid, pageContent: text, metadata: jsonb, vector: vector_embeddings
     */
    type = "postgres";
    embeddings: Embeddings;
    dbOptions: TypeORMVectorStoreArgs;

    constructor(
        tableName: string,
        embeddings: Embeddings,
        dbOptions: DatabaseConnOptions
    ) {
        this.dbOptions = {
            postgresConnectionOptions: {
                type: this.type,
                ...dbOptions,
            } as DataSourceOptions,
            tableName,
            verbose: true,
        };
        this.embeddings = embeddings;
    }

    async store() {
        const typeormVectorStore = await TypeORMVectorStore.fromDataSource(
            this.embeddings,
            this.dbOptions
        );
        await typeormVectorStore.ensureTableInDatabase();
        return typeormVectorStore;
    }
}

export { DatabaseConnOptions, TypeORMStore };
