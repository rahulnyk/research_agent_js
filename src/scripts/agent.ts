import Agent from "../agent/agent.js";
import { AgentSettings } from "../agent/agent-settings.js";
import {store} from "../vector_stores/torm_store.js";

let originalQuestion = "What according to Mahabharata are the most important duties of a person";
let settings: AgentSettings = {
    maxIter: 6,
    numQuestionPerIter: 3,
    numAtomisticQuestions: 2,
    compilerTemperature: 0,
    qaChainTemperature: 0,
    questionPrioritisationTemperature: 0,
    questionCreationTemperature: 0.5,
    questionAtomizationTemperature: 0,
    intermediateAnswerLength: 200,
    finalAnswerLength: 1000,
};

let agent = new Agent(originalQuestion, store, settings);
let res = await agent.run();
