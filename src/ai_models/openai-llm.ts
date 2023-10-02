import * as dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "langchain/llms/openai";
import { BaseLLM } from "langchain/llms/base";

class OAILLM {

   static model(temperature: number, verbose?: boolean): BaseLLM {
        return new OpenAI({
            temperature: temperature,
            openAIApiKey: process.env.OPENAI_API_KEY,
            verbose: verbose || false
        });
    }
}

export {OAILLM};