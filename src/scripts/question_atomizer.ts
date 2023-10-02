import { QuestionAtomizer } from "../chains/index.js";
import { ChatModel } from "../ai_models/openai-chat.js";
import { OAILLM } from "../ai_models/openai-llm.js";
import { string2Questions, questions2PromptString } from "../helpers/responseHelpers.js";
import { Question } from "../agent/run-model.js";

let question = "Why did the chicken names chick tried to cross the road when there was so much traffic on the road?";
let numQuestions = 5;

let temperature = 0.5;
const llm = ChatModel.model(temperature, true);
let questionAtomizer = QuestionAtomizer.from_llm(llm);
let result = await questionAtomizer.predict({
    question,
    numQuestions,
});

let questions = string2Questions(result, "unanswered", "subquestion");
console.log('Result --> ', result);
console.log('New Questions --> ', questions);
