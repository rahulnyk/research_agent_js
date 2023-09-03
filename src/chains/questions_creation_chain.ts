import * as dotenv from "dotenv";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { BaseChatModel } from "langchain/chat_models";

dotenv.config();

const PROMPT =
    "You are a research agent who is provided with a user query and some context" +
    " User query: {question}" +
    " Context: {context}" +
    " Your task is to ask questions which can help your team research on the users query" +
    " These are previously asked unansweredQuestions questions: {unansweredQuestions}." +
    " You can ask only upto {numQuestions} new questions" +
    " The new questions should have no overlap with the previously unansweredQuestions questions." +
    " Return the questions as a comma separated list." +
    " Format your response as a numbered list of questions, like:" +
    " #. First question" +
    " #. Second question" +
    " Start the list with number {startId}";

class QuestionsCreationChain extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseChatModel) {
        super({ prompt, llm });
    }

    static from_llm(llm: BaseChatModel): LLMChain {
        const questionCreationTemplate: string = PROMPT;
        const prompt = new PromptTemplate({
            template: questionCreationTemplate,
            inputVariables: [
                "question",
                "context",
                "unansweredQuestions",
                "numQuestions",
                "startId",
            ],
        });

        return new QuestionsCreationChain(prompt, llm);
    }
}

export default QuestionsCreationChain;

// import { ChatOpenAI } from "langchain/chat_models/openai";
// const llm = new ChatOpenAI({ temperature: 0 });

// async function getNewQuestions(
//     question_creation_chain: QuestionsCreationChain,
//     question: string,
//     context: string,
//     unanswered: string[],
//     numQuestions: number,
//     startId: number
// ): Promise<any[]> {
//     let unansweredQuestions: string = unanswered.join(", ");
//     const response: string = await question_creation_chain.predict({
//         question,
//         context,
//         unansweredQuestions,
//         numQuestions,
//         startId,
//     });
//     const newQuestions: string[] = response.split("\n");

//     return newQuestions
//         .filter((question) => question.trim())
//         .map((question) => ({ question }));
// }

// const question_creation_chain = QuestionsCreationChain.from_llm(llm);

// let result = await getNewQuestions(
//     question_creation_chain,
//     "Why did the chicken cross the road",
//     "The chicken was hungry, the chicken wanted to go to the shop on the other side, The chicken was not cautious",
//     ["why was chicken hungry?"],
//     2, 1
// );

// console.log(result)
