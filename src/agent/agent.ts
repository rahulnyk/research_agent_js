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
} from "../helpers/colors.js";

class Agent {
    runModel: AgentRunModel;
    modelSettings: ModelSettings;
    loop = true;
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
        do {
            currentIter++;
            console.log(
                iterationColor(
                    `\n__________ Current Iteraiton: ${currentIter} ___________\n`
                )
            );
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
            } else {
                this.runModel.setCurrentAnswer(currentAnswer);
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
            console.log("Start Id -> ", startId);
            console.log(
                thoughtColor("\nThese are the new Questions I can ask:\n"),
                newQuestionsResponse
            );

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

            console.log(
                thoughtColor("\nNext Question I need to ask:\n"),
                nextQuestionColor(this.runModel.getCurrentQuestionString())
            );

            if (currentIter >= this.modelSettings.maxIter) {
                console.log(
                    iterationColor(
                        `\n__________ Max Iterations Reached ___________\n`
                    )
                );
                this.runModel.agentLifeCycle = "stopping";
            }
        } while (this.runModel.agentLifeCycle != "stopping");

        this.runModel.agentLifeCycle = "stopped";
        console.log(this.runModel.run.questions);

        return this.runModel;
    }
}

export default Agent;
