import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { BaseLanguageModel } from "langchain/base_language";

const PROMPT =
    "You are a research agent who is provided with a user query and some context \n" +
    " User query: {question} \n --- \n" +
    " Context: {context} \n --- \n" +
    " Your task is to ask questions which can help your team research on the users query \n" +
    " These are previously asked questions: {prevQuestions}. \n --- \n" +
    " You can ask only upto {numQuestions} new questions \n" +
    " The new questions should have no overlap with the previously  questions.\n" +
    " Return the questions as a comma separated list.\n" +
    " Format your response as a numbered list of questions, like:\n" +
    " #. First question\n" +
    " #. Second question\n" +
    " Start the list with number {startId}\n";

class QuestionsCreationChain extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseLanguageModel) {
        super({ prompt, llm });
    }

    static from_llm(llm: BaseLanguageModel): LLMChain {
        const questionCreationTemplate: string = PROMPT;
        const prompt = new PromptTemplate({
            template: questionCreationTemplate,
            inputVariables: [
                "question",
                "context",
                "prevQuestions",
                "numQuestions",
                "startId",
            ],
        });

        return new QuestionsCreationChain(prompt, llm);
    }
}

export default QuestionsCreationChain;