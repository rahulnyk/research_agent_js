import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { BaseLanguageModel } from "langchain/base_language";

class QuestionsCreationChain extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseLanguageModel) {
        super({ prompt, llm });
    }

    static from_llm(llm: BaseLanguageModel): LLMChain {
        const questionCreationTemplate: string =
            "You are a part of a team. The ultimate goal of your team is to" +
            " answer the following Question: '{question}'.\n" +
            "Your team has discovered some new text that may be relevant to your ultimate goal." +
            " text: \n {context} \n" +
            "Your task is to ask new questions that may help your team achieve the ultimate goal." +
            " If you think that the text is relevant to your ultimate goal, then ask new questions." +
            " New questions should be based only on the text and the goal Question and no other privious knowledge." +
            " The new questions should have no overlap with these questions:" +
            " {prevQuestions}\n" +
            "You can ask up to {numQuestions} new questions." +
            " Return the questions as a comma separated list. " +
            " Format your response as a numbered list of questions, like:\n" +
            "n. First question\n" +
            "n. Second question\n" +
            "Start the list with number {startId}";

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
