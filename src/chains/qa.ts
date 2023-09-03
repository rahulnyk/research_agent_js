import * as dotenv from "dotenv";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { BaseChatModel } from "langchain/chat_models";

dotenv.config();

const PROMPT =
    "Use the following pieces of context" +
    " Context:" +
    " {context}" +
    " Your objective is to answer the following question" +
    " Question:" +
    " {question}" +
    " Answer based only on the context and no other previous knowledge" +
    " don't try to make up an answer." +
    " If you don't know the answer, just say that you don't know," +
    " Answer in less than 200 words." +
    " Answer :";

class QA extends LLMChain {
    constructor(prompt: PromptTemplate, llm: BaseChatModel) {
        super({ prompt, llm });
    }

    static from_llm(llm: BaseChatModel): LLMChain {
        const questionCreationTemplate: string = PROMPT;

        const prompt = new PromptTemplate({
            template: questionCreationTemplate,
            inputVariables: ["question", "context"],
        });

        return new QA(prompt, llm);
    }
}

export default QA;

// import { ChatOpenAI } from "langchain/chat_models/openai";
// const llm = new ChatOpenAI({ temperature: 0 });
// async function getAnswer(
//     qaChain: QA,
//     question: string,
//     context: string,
// ): Promise<string> {
//     const response: string = await qaChain.predict({
//         question,
//         context,
//     });
//     return response;
// }

// const qaChain = QA.from_llm(llm);

// let result = await getAnswer(
//     qaChain,
//     "Why did the chicken cross the road?",
//     "chieck was hungry, there was nothing on this side of the road, but it could see the shops on the other side of the road"
// );

// console.log(result)
