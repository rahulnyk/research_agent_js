import { MostPertinentQuestion } from "../chains/index.js";
import { ChatModel } from "../ai_models/openai-chat.js";
import {
    string2Questions,
    questions2PromptString,
} from "../helpers/responseHelpers.js";
import { Question } from "../agent/run-model.js";
import { OAILLM } from "../ai_models/openai-llm.js";

let originalQuestion = "Why did the chicken cross the road";

let qs: Question[] = [
    {
        id: 1,
        question:
            "What is the significance of the shop on the other side of the road?",
        status: "unanswered",
    },
    {
        id: 11,
        question:
            "Was there any specific reason why the chicken chose to go to the shop?",
        status: "unanswered",
    },
    {
        id: 5,
        question:
            "Was there any other alternative route for the chicken to reach the shop?",
        status: "unanswered",
    },
    {
        id: 6,
        question:
            "Did the chicken encounter any obstacles on its way to the shop?",
        status: "unanswered",
    },
];
let unansweredQuestions = questions2PromptString(qs);

console.log(typeof unansweredQuestions, unansweredQuestions);

let temperature = 0.5;
const llm = ChatModel.model(temperature, true);
let mostPertinentQuestion = MostPertinentQuestion.from_llm(llm);
let result = await mostPertinentQuestion.predict({
    originalQuestion,
    unansweredQuestions,
});

let pertinentQuestion = string2Questions(result, "answered");
console.log(typeof result, result);
console.log(typeof pertinentQuestion, pertinentQuestion);
