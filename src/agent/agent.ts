// import { Document } from "langchain/document";
// import { Question } from "./run-model.js";
import { AgentRunModel } from "./run-model.js";
import { ModelSettings } from "./model-settings.js";
import {
    ResearchCompiler,
    QuestionsCreationChain,
    MostPertinentQuestion,
    RetrievalStuffQA,
} from "../chains/index.js";
import { ChatModel } from "../ai_models/openAi.js";
import { VectorStore } from "langchain/vectorstores";
import {
    string2Questions,
    questions2String,
    documents2String,
} from "../helpers/responseHelpers.js";
import {
    iterationColor,
    nextQuestionColor,
    unansweredQuestionsColor,
    thoughtColor,
    errorColor,
    answerColor,
    finalAsnwerColor,
} from "../helpers/colors.js";

import {
    logThought,
    logAnswer,
    logFinalAnswer,
    logQuestions,
    logNextQuestion,
    logIteration,
    logError,
} from "../helpers/agentLogger.js";

class Agent {
    runModel: AgentRunModel;
    modelSettings: ModelSettings;
    verbose = false;
    vectorStore: VectorStore;
    questionCreationChain: QuestionsCreationChain;
    mostPertinentQuestion: MostPertinentQuestion;
    qaChain: RetrievalStuffQA;
    compiler: ResearchCompiler;

    constructor(
        originalQuestion: string,
        vectorStore: VectorStore,
        modelSettings: ModelSettings,
        verbose?: boolean
    ) {
        this.runModel = new AgentRunModel(originalQuestion);
        this.vectorStore = vectorStore;
        this.modelSettings = modelSettings;
        this.runModel.agentLifeCycle = "starting";
        this.verbose = verbose || this.verbose;
        this.questionCreationChain = QuestionsCreationChain.from_llm(
            ChatModel.model(this.modelSettings.questionCreationTemperature)
        );
        this.mostPertinentQuestion = MostPertinentQuestion.from_llm(
            ChatModel.model(
                this.modelSettings.questionPrioritisationTemperature
            )
        );
        this.compiler = ResearchCompiler.from_llm(
            ChatModel.model(this.modelSettings.compilerTemperature)
        );
        this.qaChain = RetrievalStuffQA.from_llm(
            ChatModel.model(this.modelSettings.qaChainTemperature),
            vectorStore.asRetriever(),
            { verbose: false, returnSourceDocuments: true }
        );
    }

    async run() {
        let currentIter = 0;
        this.runModel.agentLifeCycle = "running";
        logThought("Researching on:\n", 0);
        logQuestions(this.runModel.getOriginalQuestion(), 0);
        do {
            currentIter++;

            let currentQuestion = this.runModel.getCurrentQuestionString();

            /** STEP 1
             * Generate context with current question.
             */
            let { text: currentAnswer, sourceDocuments: currentDocuments } =
                await this.qaChain.call({
                    query: currentQuestion,
                });
            // For the first run, the answer should be added to the answerpad.
            if (currentIter == 1) {
                this.runModel.setAnswerpad(currentAnswer);

                logThought("Here is Some Initial Information: \n", currentIter);
                logAnswer(currentAnswer, currentIter);
            } else {
                this.runModel.setCurrentAnswer(currentAnswer);

                logThought("Answer: \n", currentIter);
                logAnswer(currentAnswer, currentIter);
            }
            this.runModel.addDocuments(currentDocuments);
            // console.log(currentQuestion, currentAnswer);

            /** STEP 2
             * Generate more questions.
             * using originalQuestion, currentDocuments as context and prevQuestions
             * Passing the numQuestions from mode settings
             */
            let startId = this.runModel.getLastQuestionId() + 1;
            let prevQuestions = questions2String(
                this.runModel.getAllQuestions()
            );
            // Questions creation prompt call.
            let newQuestionsResponse = await this.questionCreationChain.predict(
                {
                    question: this.runModel.getOriginalQuestion(),
                    context: documents2String(currentDocuments),
                    prevQuestions,
                    numQuestions: this.modelSettings.numQuestionPerIter,
                    startId,
                }
            );
            let newQuestions = string2Questions(
                newQuestionsResponse,
                "unanswered"
            );

            logThought(
                "\nThese are the new Questions I can ask:\n",
                currentIter
            );
            logQuestions(newQuestionsResponse, currentIter);

            this.runModel.addQuestions(newQuestions);

            /** STEP 3
             * Find out the most pertinent question out of the unanswered questions.
             */
            let nextQuestionResponse = await this.mostPertinentQuestion.predict(
                {
                    originalQuestion: this.runModel.getOriginalQuestion(),
                    unansweredQuestions: questions2String(
                        this.runModel.getUnansweredQuestions()
                    ),
                }
            );
            let nextQuestion = string2Questions(
                nextQuestionResponse,
                "current"
            );
            this.runModel.setCurrentQuestion(nextQuestion[0]);

            logThought("Next Question I need to ask:\n", currentIter);
            logNextQuestion(
                this.runModel.getCurrentQuestionString(),
                currentIter
            );

            if (currentIter >= this.modelSettings.maxIter) {
                logThought(
                    "I am done with maximum allowed Iterations",
                    currentIter
                );
                this.runModel.agentLifeCycle = "stopping";
            }
        } while (this.runModel.agentLifeCycle != "stopping");

        /** STEP 4
         * Compile the results if max iterations are done
         */
        let finalAnswer = await this.compiler.predict({
            question: this.runModel.getOriginalQuestion(),
            context: this.runModel.getAllAnsweresString(),
            prevAnswer: this.runModel.getAnswerpad(),
        });
        this.runModel.setFinalAnswer(finalAnswer);

        logThought(
            `Here is the final answer after ${this.modelSettings.maxIter} hops:\n`
        );
        logFinalAnswer(finalAnswer);

        this.runModel.agentLifeCycle = "stopped";

        return this.runModel;
    }
}

export default Agent;
