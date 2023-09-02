import * as dotenv from 'dotenv';
import { LLMChain, PromptTemplate } from "langchain";
import { BaseChatModel } from "langchain/chat_models";

dotenv.config();

class QuestionsCreationChain extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseChatModel) {
        super({prompt, llm});
    }

    static from_llm(llm: BaseChatModel): LLMChain {
        const taskCreationTemplate: string =
            "You are a research agent who is provided with a user query and some context" +
            " User query: {question}" +
            " Context: {context}" +
            " Your task is to ask questions which can help your team research on the users query" +
            " These are previously asked unanswered questions: {unanswered_questions}." +
            " You can ask only upto {num_questions} new questions" +
            " The new questions should have no overlap with the previously unanswered questions." +
            " Return the questions as a comma separated list." +
            " Format your response as a numbered list of questions, like:" +
            " #. First question" +
            " #. Second question" +
            " Start the list with number {start_id}"

        const prompt = new PromptTemplate({
            template: taskCreationTemplate,
            inputVariables: [
                "question",
                "context",
                "unanswered_questions",
                "num_questions",
                "start_id"
            ],
        });

        return new QuestionsCreationChain(prompt, llm);
    }
}

export default QuestionsCreationChain;