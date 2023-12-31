export interface AgentSettings {
    maxIter: number;
    numQuestionPerIter: number;
    questionCreationTemperature: number;
    questionAtomizationTemperature: number;
    questionPrioritisationTemperature: number;
    compilerTemperature: number; 
    refineAnswerTemperature: number;
    qaChainTemperature: number;
    numAtomisticQuestions: number;
    intermediateAnswerLength: number;
    finalAnswerLength: number;
}
