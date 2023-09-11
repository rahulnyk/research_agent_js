import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { BaseLanguageModel } from "langchain/base_language";

const PROMPT: string =
    "You are provided with the following list of questions:\n" +
    " {unansweredQuestions}\n--- \n" +
    " Your task is to find one question from the given list\n" +
    " that is the most pertinent to the following query\n" +
    " {originalQuestion} \n--- \n" +
    " Respond with one question out of the provided list of questions\n" +
    " Return the questions as it is without any edits\n" +
    " Format your response like: \n" +
    " n. question";

class MostPertinentQuestion extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseLanguageModel) {
        super({ prompt, llm });
    }

    static from_llm(llm: BaseLanguageModel): LLMChain {
        const pertinentQuestionTemplate: string = PROMPT;

        const prompt = new PromptTemplate({
            template: pertinentQuestionTemplate,
            inputVariables: ["originalQuestion", "unansweredQuestions"],
        });

        return new MostPertinentQuestion(prompt, llm);
    }
}

export default MostPertinentQuestion;

