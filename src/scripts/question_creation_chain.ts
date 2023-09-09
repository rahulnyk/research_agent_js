import { QuestionsCreationChain } from "../chains/index.js";
import { ChatModel } from "../ai_models/openAi.js";
import { string2Questions, questions2String } from "../helpers/responseHelpers.js";
import { Question } from "../agent/run-model.js";

let question = "Why did the chicken cross the road";
let context =
    "The chicken was hungry, the chicken wanted to go to the shop on the other side, The chicken was not cautious";

let qs: Question[] = [
    {
      id: 1,
      question: 'What is the significance of the shop on the other side of the road?',
      status: 'unanswered'
    },
    {
      id: 2,
      question: 'Was there any specific reason why the chicken chose to go to the shop?',
      status: 'unanswered'
    },
    {
      id: 3,
      question: 'Why was chicken hungry?',
      status: 'unanswered'
    },
    {
      id: 4,
      question: 'Did the road had too much traffic?',
      status: 'unanswered'
    },
  ];
let prevQuestions = questions2String(qs)

console.log('Previous Question String -->', prevQuestions)

let numQuestions = 2;
let startId = 5;

let temperature = 0;
const llm = ChatModel.model(temperature, true);
let questionCreationChain = QuestionsCreationChain.from_llm(llm);
let result = await questionCreationChain.predict({
    question,
    context,
    prevQuestions,
    numQuestions,
    startId,
});

let newQuestions = string2Questions(result, "unanswered");
console.log('Result --> ', result);
console.log('New Questions --> ', newQuestions);
