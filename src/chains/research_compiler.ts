import * as dotenv from "dotenv";
import { BaseLanguageModel } from "langchain/base_language";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

dotenv.config();

class ResearchCompiler extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseLanguageModel) {
        super({ prompt, llm });
    }
    static from_llm(llm: BaseLanguageModel): LLMChain {
        const compilerTemplate =
            "You are a research agent who answers complex questions with clear, crisp and detailed answers." +
            " You are provided with a question and some research notes prepared by your team." +
            " Question: '{question}' \n" +
            " Notes: [{notes}] \n" +
            " Your task is to answer the question entirely based on the given notes." +
            " The notes contain a list of intermediate-questions and answers that may be helpful to you in writing an answer." +
            " Use only the most relevant information from the notes while writing your answer." +
            " Do not use any prior knowledge while writing your answer, Do not make up the answer." +
            " If the notes are not relevant to the question, just return 'Context is insufficient to answer the question'." +
            " Remember your goal is to answer the question as objectively as possible." +
            " Write your answer succinctly in less than {answerLength} words.";

        const prompt = new PromptTemplate({
            template: compilerTemplate,
            inputVariables: ["question", "notes", "answerLength"],
        });
        return new ResearchCompiler(prompt, llm);
    }
}
export default ResearchCompiler;
