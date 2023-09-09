import Agent from "../agent/agent.js";
import { ModelSettings } from "../agent/model-settings.js";
import store from "../vector_stores/torm_supabase_store.js";

let originalQuestion = "Why was Arjuna ready to Kill Yudhishthira?";
let settings: ModelSettings = {
    maxIter: 3,
    numQuestionPerIter: 2,
    questionCreationTemperature: 0.2,
    questionPrioritisationTemperature: 0.2,
    analyserTemperature: 0.2,
    compilerTemperature: 0.2,
    qaChainTemperature: 0.2,
};

let agent = new Agent(originalQuestion, store, settings);
let res = await agent.run();
