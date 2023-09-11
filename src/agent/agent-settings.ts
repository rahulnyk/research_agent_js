export interface AgentSettings {
    maxIter: number;
    numQuestionPerIter: number;
    questionCreationTemperature: number;
    questionPrioritisationTemperature: number;
    // analyserTemperature: number;
    compilerTemperature: number; 
    qaChainTemperature: number;
}
