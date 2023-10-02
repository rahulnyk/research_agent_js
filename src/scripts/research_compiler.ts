import { ResearchCompiler } from "../chains/index.js";
import { ChatModel } from "../ai_models/openai-chat.js";
import { Question } from "../agent/run-model.js";
import { OAILLM } from "../ai_models/openai-llm.js";

let question = "Why was Arjuna ready to Kill Yudhishthira?";

let qs: Question[] = [
    {
        id: 1,
        question:
            "What is the significance of the shop on the other side of the road?",
        status: "unanswered",
    },
    {
        id: 2,
        question:
            "Was there any specific reason why the chicken chose to go to the shop?",
        status: "unanswered",
    },
    {
        id: 3,
        question:
            "What led to Arjuna's anger towards Yudhisthira in the first place?",
        status: "answered",
        answer: "Arjuna's anger towards Yudhisthira was sparked by his older brother's actions of casting the whole kshatriya race into hell because of his desire to gamble. Yudhisthira's gambling addiction and his decision to gamble away their kingdom and wealth had deeply affected Arjuna. This betrayal and loss of their rightful inheritance caused Arjuna to become scorched by Yudhisthira's words, leading him to draw his sword and be prepared to kill his brother. However, Lord Krishna quickly pacified Arjuna and reminded him of their true enemies, Dhritarastra's sons and the mighty Karna, whom Arjuna had vowed to slay.",
    },
    {
        id: 4,
        question:
            "What were the specific actions or words of Yudhisthira that provoked Arjuna to draw his sword?",
        status: "answered",
        answer: "Based on the given context, it is not explicitly mentioned what specific actions or words of Yudhisthira provoked Arjuna to draw his sword. The context states that Arjuna was scorched by Yudhisthira's words, but the exact content of those words is not provided. It is only mentioned that Arjuna was prepared to kill his brother in response to Yudhisthira's words. Therefore, without further information, it is not possible to determine the specific actions or words of Yudhisthira that provoked Arjuna's reaction.",
    },
];

let answeredQs = qs.filter(q => q.status=="answered")
let notes = answeredQs.reduce((c, q) => {
    return c + `{ Question: ${q.question}, Answer: ${q.answer} }`
}, '')
let answerLength = 200

console.log('Question: ', question);
console.log('Context: ', notes);


let temperature = 0;
const llm = ChatModel.model(temperature, true);
let compiler = ResearchCompiler.from_llm(llm);
let result = await compiler.predict({
    question,
    notes,
    answerLength,
});

console.log("Result --> ", result);
