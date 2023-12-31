import { RetrievalStuffQA } from "../chains/index.js";
import { ChatModel } from "../ai_models/openai-chat.js";
import { OAILLM } from "../ai_models/openai-llm.js";
import { documents2String } from "../helpers/responseHelpers.js";
import {store} from "../vector_stores/torm_store.js";

let question = "Why did mahabharata war happen?";

let temperature = 0;
const llm = ChatModel.model(temperature, true);
const answerLength = 200

let chain = RetrievalStuffQA.from_llm(llm, store.asRetriever(), answerLength, {
    verbose: true,
    returnSourceDocuments: true,
});

let { text, sourceDocuments } = await chain.call({
    query: question,
});

let docString = documents2String(sourceDocuments);

console.log("Response Text: ", text);
console.log("Response Documents: ", sourceDocuments);
console.log("Response Documents String: ", docString);
