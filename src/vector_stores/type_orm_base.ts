import { DataSourceOptions } from "typeorm";
import {
    TypeORMVectorStore,
    TypeORMVectorStoreArgs,
} from "langchain/vectorstores/typeorm";
import { Embeddings } from "langchain/embeddings";

interface DatabaseConnOptions {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: number;
    tableName?: string;
}

class TypeORMStore {
    /**
     * This is just a thin wrapper over the type orm store
     * The table schema for embedding table
     * id: uuid, pageContent: text, metadata: jsonb, vector: vector_embeddings
     * Default tablename is torm_embeddings
     */
    
    type = "postgres";
    embeddings: Embeddings;
    tableName = "torm_embeddings";

    dbOptions: TypeORMVectorStoreArgs;

    constructor(embeddings: Embeddings, options?: DatabaseConnOptions) {
        this.dbOptions = {
            postgresConnectionOptions: {
                type: this.type,
                host: options?.host || '',
                port: options?.port || '',
                username: options?.username || '',
                password: options?.password || '',
                database: options?.database || '',
            } as DataSourceOptions,
            tableName: options?.tableName || this.tableName,
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

export {DatabaseConnOptions, TypeORMStore}

