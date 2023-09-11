import * as dotenv from "dotenv";
import { BaseLanguageModel } from "langchain/base_language";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

dotenv.config();

const PROMPT: string =
    "Your task is to answer the users question\n" +
    " Question: {question} \n --- \n" +
    " You can use previously found incomplete answers (only if needed)\n" +
    " Previous Answer: {prevAnswer} \n --- \n" +
    " Use the following context to create a complete and elaborate answer.\n" +
    " Context: {context} \n --- \n" +
    " The context includes answers to several similar questions\n" +
    " Give an elaborate answer. don't try to make up an answer.\n" +
    " If you don't know the answer, just say that you don't know.\n" +
    " Answer only based on the given information, and no other prior knowledge.\n" +
    " Answer :";

class ResearchCompiler extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseLanguageModel) {
        super({ prompt, llm });
    }
    static from_llm(llm: BaseLanguageModel): LLMChain {
        const compilerTemplate = PROMPT;
        const prompt = new PromptTemplate({
            template: compilerTemplate,
            inputVariables: ["question", "context", "prevAnswer"],
        });
        return new ResearchCompiler(prompt, llm);
    }
}
export default ResearchCompiler;
