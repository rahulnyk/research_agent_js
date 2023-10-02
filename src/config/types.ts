
export interface DatabaseConnOptions {
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    host: string | undefined;
    port: number;
    user: string | undefined;
}


export type AppConfig = {
    openApiKey: string | undefined;
    databaseConnOptions: DatabaseConnOptions;     
}