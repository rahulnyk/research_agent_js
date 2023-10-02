import { BaseLanguageModel } from "langchain/base_language";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

class RefineAnswer extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseLanguageModel, verbose?: boolean) {
        super({ prompt, llm, verbose });
    }
    static from_llm(llm: BaseLanguageModel, verbose?: boolean): LLMChain {
        const refineAnswerTemplate =
            "You are provided with the following question. \n" +
            " Question: {originalQuestion}\n" +
            " You are also provided with an existing answer to the question.\n-------\n" +
            " Existing Answer: {existingAnswer}\n-------\n" + 
            " You have the opportunity to improve upon the existing answer as apropriate (only if needed)" +
            " with the information given in the following context. \n-------\n" +
            " Context: {context} \n-------\n" +
            " Given the context, refine or enrich the existing answer to better answer the question."+ 
            " If the context isn't useful, return the existing answer.";

        const prompt = new PromptTemplate({
            template: refineAnswerTemplate,
            inputVariables: ["originalQuestion", "existingAnswer", "context"],
        });
        return new RefineAnswer(prompt, llm, verbose || false);
    }
}
export default RefineAnswer;
