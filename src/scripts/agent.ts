import Agent from "../agent/agent.js";
import { AgentSettings } from "../agent/agent-settings.js";
import {store} from "../vector_stores/torm_store.js";

let originalQuestion = "What according to Mahabharata are the most important duties of a person";
let settings: AgentSettings = {
    maxIter: 5,
    numQuestionPerIter: 2,
    questionCreationTemperature: 0.5,
    questionPrioritisationTemperature: 0.5,
    // analyserTemperature: 0,
    compilerTemperature: 0,
    qaChainTemperature: 0,
};

let agent = new Agent(originalQuestion, store, settings);
let res = await agent.run();
