import * as dotenv from "dotenv";
import { LLMChain } from "langchain/chains";
import { BaseChatModel } from "langchain/chat_models";
import { PromptTemplate } from "langchain/prompts";

dotenv.config();

const PROMPT: string =
    "Your task is to answer the users question" +
    " Question: {question} \n" +
    " You can use previously found incomplete answers (only if needed)" +
    " Previous Answer: {prev_answer} \n" +
    " Use the following context to create a complete and elaborate answer." +
    " Context: {context} \n" +
    " The context includes answers to several similar questions" +
    " Give an elaborate answer. don't try to make up an answer." +
    " If you don't know the answer, just say that you don't know," +
    " Answer only based on the given information, and no other prior knowledge." +
    " Answer :";

class ResearchCompiler extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseChatModel) {
        super({ prompt, llm });
    }
    static from_llm(llm: BaseChatModel): LLMChain {
        const questionCreationTemplate = PROMPT;
        const prompt = new PromptTemplate({
            template: questionCreationTemplate,
            inputVariables: ["question", "context"],
        });
        return new ResearchCompiler(prompt, llm);
    }
}
export default ResearchCompiler;
