import * as dotenv from "dotenv";
dotenv.config();
import { ChatOpenAI } from "langchain/chat_models/openai";

export class ChatModel {

   static model(temperature: number, verbose?: boolean): ChatOpenAI {
        return new ChatOpenAI({
            temperature: temperature,
            openAIApiKey: process.env.OPENAI_API_KEY,
            verbose: verbose || false
        });
    }
}

