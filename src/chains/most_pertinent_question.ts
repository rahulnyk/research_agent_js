import * as dotenv from "dotenv";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { BaseChatModel } from "langchain/chat_models";

dotenv.config();

const PROMPT: string =
    "You are provided with the following list of questions:" +
    " {unansweredQuestions} \n" +
    " Your task is to find one question from the given list" +
    " that is the most pertinent to the following query" +
    " {originalQuestion} \n" +
    " Respond with one question out of the provided list of questions" +
    " Return the questions as it is without any edits" +
    " Format your response like:" +
    " #. question";

class MostPertinentQuestion extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseChatModel) {
        super({ prompt, llm });
    }

    static from_llm(llm: BaseChatModel): LLMChain {
        const pertinentQuestionTemplate: string = PROMPT;

        const prompt = new PromptTemplate({
            template: pertinentQuestionTemplate,
            inputVariables: ["originalQuestion", "unansweredQuestions"],
        });

        return new MostPertinentQuestion(prompt, llm);
    }
}

export default MostPertinentQuestion;

// --  Test it out --
// import { ChatOpenAI } from "langchain/chat_models/openai";
// const llm = new ChatOpenAI({ temperature: 0 });
// async function getPertinentQuestion(
//     mostPertinentQuestionChain: MostPertinentQuestion,
//     question: string,
//     unansweredQuestions: string[],
// ): Promise<any[]> {
//     let unanswered: string = unansweredQuestions.join(", ");
//     const response: string = await mostPertinentQuestionChain.predict({
//         originalQuestion: question,
//         unansweredQuestions: unanswered,
//     });
//     const pertinentQuestion: string[] = response.split("\n");

//     return pertinentQuestion;
// }

// const mostPertinentQuestionChain = MostPertinentQuestion.from_llm(llm);

// let result = await getPertinentQuestion(
//     mostPertinentQuestionChain,
//     "Why did the chicken cross the road",
//     ['What type of shop was on the other side of the road that the chicken wanted to go to?', 'Was there any specific reason why the chicken was not cautious while crossing the road?'],
// );

// console.log(result)
