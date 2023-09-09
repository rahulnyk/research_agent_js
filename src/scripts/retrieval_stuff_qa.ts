import { RetrievalStuffQA } from "../chains/index.js";
import { ChatModel } from "../ai_models/openAi.js";
import { documents2String } from "../helpers/responseHelpers.js";
import store from "../vector_stores/torm_supabase_store.js";

let question = "Why did mahabharata war happen?";

let temperature = 0;
const llm = ChatModel.model(temperature);

let chain = RetrievalStuffQA.from_llm(llm, store.asRetriever(), {
    verbose: false,
    returnSourceDocuments: true,
});

let { text, sourceDocuments } = await chain.call({
    query: question,
});

let docString = documents2String(sourceDocuments);

console.log("Response Text: ", text);
console.log("Response Documents: ", sourceDocuments);
console.log("Response Documents String: ", docString);
