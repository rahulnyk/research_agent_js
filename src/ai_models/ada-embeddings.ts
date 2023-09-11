import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const embeddingModel = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY});
