import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { BaseLanguageModel } from "langchain/base_language";

class QuestionAtomizer extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseLanguageModel) {
        super({ prompt, llm });
    }

    static from_llm(llm: BaseLanguageModel): LLMChain {
        const questionAtomizerTemplate: string =
            " Your are provided with the following question:" +
            " '{question}' \n" +
            " Your task is to split the given question in at most {numQuestions} very" +
            " simple, basic and atomist sub-questions (only if needed) using only the" +
            " information given in the question and no other prior knowledge." +
            " The sub-questions should be directly related to the intent of the original question." +
            " Consider the primary subject and the predicate of the question (if any) when creating sub questions.\n" +
            " Consider also the Characters, Ideas, Concepts, Entities, Actions, Or Events mentioned" +
            " in the question (if any) when creating the sub questions.\n" +
            " The sub questions should have no semantic overlap with each other." +
            " Format your response like: \n" +
            " n. question";

        const prompt = new PromptTemplate({
            template: questionAtomizerTemplate,
            inputVariables: [
                "question",
                "numQuestions"
            ],
        });

        return new QuestionAtomizer(prompt, llm);
    }
}

export default QuestionAtomizer;
