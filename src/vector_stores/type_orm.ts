import * as dotenv from "dotenv";
dotenv.config();

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
    port = 5432;
    host = "localhost";
    tableName = "torm_embeddings";
    username = process.env.PGVECTOR_USER;
    password = process.env.PGVECTOR_PASSWORD;
    database = process.env.PGVECTOR_DATABASE;
    embeddings: Embeddings;

    dbOptions: TypeORMVectorStoreArgs;

    constructor(embeddings: Embeddings, options?: DatabaseConnOptions) {
        this.dbOptions = {
            postgresConnectionOptions: {
                type: this.type,
                host: options?.host || this.host,
                port: options?.port || this.port,
                username: options?.username || this.username,
                password: options?.password || this.password,
                database: options?.database || this.database,
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

// const embeddings = new OpenAIEmbeddings();
// const typeORM = new TypeORMStore(embeddings);
// const store = await typeORM.store();

// store.ensureTableInDatabase();
