import { RetrievalQAChain, RetrievalQAChainInput } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { BaseLanguageModel } from "langchain/base_language";
import { BaseRetriever } from "langchain/schema/retriever";
import { loadQAStuffChain } from "langchain/chains";

interface StuffChainOptions {
    verbose?: boolean;
    returnSourceDocuments?: boolean;
}

export class RetrievalStuffQA extends RetrievalQAChain {
    private constructor(fields: RetrievalQAChainInput) {
        super(fields);
    }

    static from_llm(
        llm: BaseLanguageModel,
        retriever: BaseRetriever,
        answerLength: number,
        options?: StuffChainOptions
    ): RetrievalQAChain {
        const promptAnswerLength = `Answer as succinctly as possible in less than ${answerLength} words.`;
        const promptTemplate =
            "You are provided with a question and some helpful context to answer the question." +
            " Question: '{question}'\n" +
            " Context: [{context}] \n\n" +
            "Your task is to answer the question based in the information given in the context" +
            " Answer the question entirely based on the context and no other previous knowledge." +
            " If the context provided is empty or irrelevant, just return 'Context not sufficient'.\n" +
            promptAnswerLength;
        const prompt = PromptTemplate.fromTemplate(promptTemplate);

        const qaChain = loadQAStuffChain(llm, {
            prompt: prompt,
            verbose: options?.verbose,
        });
        return new RetrievalStuffQA({
            retriever,
            combineDocumentsChain: qaChain,
            ...options,
        });
    }
}
