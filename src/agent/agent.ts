import { AgentRunModel, Question } from "./run-model.js";
import { AgentSettings } from "./agent-settings.js";
import {
    QuestionAtomizer,
    QuestionsCreationChain,
    MostPertinentQuestion,
    RetrievalStuffQA,
    ResearchCompiler,
} from "../chains/index.js";
import { ChatModel, OAILLM } from "../ai_models/index.js";
import { VectorStore } from "langchain/vectorstores";
import {
    string2Questions,
    questions2PromptString,
    documents2String,
    qA2PromptString,
} from "../helpers/responseHelpers.js";

import {
    logThought,
    logAnswer,
    logFinalAnswer,
    logQuestions,
    logNextQuestion,
    logError,
    logQuestionList,
} from "../helpers/agentLogger.js";

class Agent {
    runModel: AgentRunModel;
    agentSettings: AgentSettings;
    verbose = false;
    vectorStore: VectorStore;
    questionAtomizer: QuestionAtomizer;
    questionCreator: QuestionsCreationChain;
    pertinentQuestionSelector: MostPertinentQuestion;
    qaChain: RetrievalStuffQA;
    compiler: ResearchCompiler;

    constructor(
        originalQuestion: string,
        vectorStore: VectorStore,
        agentSettings: AgentSettings,
        verbose?: boolean
    ) {
        this.runModel = new AgentRunModel(originalQuestion);
        this.vectorStore = vectorStore;
        this.agentSettings = agentSettings;
        this.runModel.agentLifeCycle = "starting";
        this.verbose = verbose || this.verbose;
        this.questionAtomizer = QuestionAtomizer.from_llm(
            ChatModel.model(this.agentSettings.questionAtomizationTemperature)
        );
        this.questionCreator = QuestionsCreationChain.from_llm(
            ChatModel.model(this.agentSettings.questionCreationTemperature)
        );
        this.pertinentQuestionSelector = MostPertinentQuestion.from_llm(
            ChatModel.model(
                this.agentSettings.questionPrioritisationTemperature
            )
        );
        this.compiler = ResearchCompiler.from_llm(
            ChatModel.model(this.agentSettings.compilerTemperature), 
        );
        this.qaChain = RetrievalStuffQA.from_llm(
            ChatModel.model(this.agentSettings.qaChainTemperature),
            vectorStore.asRetriever(),
            this.agentSettings.intermediateAnswerLength,
            { verbose: verbose, returnSourceDocuments: true }
        );
    }

    async run() {
        let currentIter = 0;
        this.runModel.agentLifeCycle = "running";
        logThought("Researching on:");
        logQuestions(this.runModel.getOriginalQuestion());

        /** STEP 0: Atomize the question.
         */

        let atomizedQuestionsResponse = await this.questionAtomizer.predict({
            question: this.runModel.getOriginalQuestion(),
            numQuestions: this.agentSettings.numAtomisticQuestions,
        });
        let atomizedQuestions = string2Questions(
            atomizedQuestionsResponse,
            "unanswered",
            "subquestion"
        );
        this.runModel.addQuestions(atomizedQuestions);

        for (let q of this.runModel.getUnansweredQuestions()) {
            logThought("Related Question");
            logQuestions(q.question);
            let { text, sourceDocuments } = await this.qaChain.call({
                query: q.question,
            });
            this.runModel.setAnswer(q.id, {
                answer: text,
                documents: sourceDocuments,
            });
            logAnswer(text)
        }

        let currentContext = qA2PromptString(
            this.runModel.getAnsweredQuestions()
        );
        // logThought(`Current Context: ${currentContext}`);

        do {
            currentIter++;
            /** STEP 1: Generate more questions.
             * Using originalQuestion, context and prevQuestions
             */
            let startId = this.runModel.getLastQuestionId() + 1;
            let prevQuestions = questions2PromptString(
                this.runModel.getAllQuestions()
            );
            let newQuestionsResponse = await this.questionCreator.predict({
                question: this.runModel.getOriginalQuestion(),
                context: currentContext,
                prevQuestions,
                numQuestions: this.agentSettings.numQuestionPerIter,
                startId,
            });
            let newQuestions = string2Questions(
                newQuestionsResponse,
                "unanswered",
                "hop"
            );

            logThought("\nThese are the new Questions I can ask:", currentIter);
            logQuestions(newQuestionsResponse, currentIter);

            this.runModel.addQuestions(newQuestions);

            /** STEP 2: Find out the most pertinent question out of the unanswered questions.
             */
            let nextQuestionResponse =
                await this.pertinentQuestionSelector.predict({
                    originalQuestion: this.runModel.getOriginalQuestion(),
                    unansweredQuestions: questions2PromptString(
                        this.runModel.getUnansweredQuestions()
                    ),
                });
            let currentQuestion = string2Questions(nextQuestionResponse)[0];
            let currentQuestionId = currentQuestion.id;

            logThought("\nNext Question I need to ask: ", currentIter);
            logNextQuestion(
                `${currentQuestionId}. ${currentQuestion.question}`,
                currentIter
            );

            this.runModel.setCurrentQuestion(currentQuestionId);

            /** STEP 3: Answer the current question and set the current context to the answer
             */
            let { text, sourceDocuments } = await this.qaChain.call({
                query: this.runModel.getCurrentQuestion().question,
            });
            this.runModel.setAnswer(currentQuestionId, {
                answer: text,
                documents: sourceDocuments,
            });
            currentContext = text;
            logThought("\nAnswer: ");
            logAnswer(text);

            let questionList = this.runModel.getAllQuestions().reduce((c, q) => {
                return c + `[${q.status}] ${q.id}. ${q.question}\n`
            }, '')
            logQuestionList(questionList);

            if (currentIter >= this.agentSettings.maxIter) {
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
        let notes = qA2PromptString(this.runModel.getAnsweredQuestions());
        let finalAnswer = await this.compiler.predict({
            question: this.runModel.getOriginalQuestion(),
            notes,
            answerLength: this.agentSettings.finalAnswerLength,
        });
        this.runModel.setFinalAnswer(finalAnswer);

        logThought(
            `Here is the final answer after ${this.agentSettings.maxIter} hops:\n`
        );
        logFinalAnswer(finalAnswer);

        this.runModel.agentLifeCycle = "stopped";

        return this.runModel;
    }
}

export default Agent;
