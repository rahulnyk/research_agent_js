import {
    RetrievalQAChain,
    RetrievalQAChainInput,
} from "langchain/chains";
import { ChatModel } from "../ai_models/openAi.js";
import { PromptTemplate } from "langchain/prompts";
import store from "../vector_stores/torm_supabase_store.js";
import { BaseLanguageModel } from "langchain/base_language";
import { BaseRetriever } from "langchain/schema/retriever";
import { loadQAStuffChain } from "langchain/chains";

const model = ChatModel.model(0);
const retriever = store.asRetriever();

const promptTemplate =
    "Use the following pieces of context\n" +
    " Context: {context}\n --- \n" +
    " Your objective is to answer the following question\n" +
    " Question:{question}\n --- \n" +
    " Answer based only on the context and no other previous knowledge.\n" +
    " don't try to make up an answer.\n" +
    " If you don't know the answer, just say that you don't know.\n" +
    " Answer in less than 200 words.\n" +
    " Answer :";

const prompt = PromptTemplate.fromTemplate(promptTemplate);


interface StuffChainOptions {
    verbose?: boolean,
    returnSourceDocuments?: boolean,
}

export class RetrievalStuffQA extends RetrievalQAChain {
    private constructor(fields: RetrievalQAChainInput) {
        super(fields);
    }

    static from_llm(
        llm: BaseLanguageModel,
        retriever: BaseRetriever,
        options?: StuffChainOptions,
    ): RetrievalQAChain {
        const qaChain = loadQAStuffChain(llm, {
            prompt: prompt, verbose: options?.verbose,
        });
        return new RetrievalStuffQA({
            retriever,
            combineDocumentsChain: qaChain,
            ...options,
        });
    }
}