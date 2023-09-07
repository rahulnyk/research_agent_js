import * as dotenv from "dotenv";
dotenv.config();
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";


const embeddingModel = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY});

class ChatModel {

   static model(temperature: number): ChatOpenAI {
        return new ChatOpenAI({
            temperature: temperature,
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
    }
}

export {embeddingModel, ChatModel};