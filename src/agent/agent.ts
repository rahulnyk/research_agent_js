import { AgentRunModel, Question } from "./run-model.js";
import { ModelSettings } from "./model-settings.js";
import {
    ResearchCompiler,
    QuestionCreationChain,
    MostPertinentQuestion,
    RetrievalStuffQA,
} from "../chains/index.js";
import { ChatModel } from "../ai_models/openAi.js";
import { VectorStore } from "langchain/vectorstores";
import { Document } from "langchain/document";

class Agent {
    runModel: AgentRunModel;
    modelSettings: ModelSettings;
    loop = true;
    verbose = false;
    vectorStore: VectorStore;
    questionCreationChain: QuestionCreationChain;
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
        this.questionCreationChain = QuestionCreationChain.from_llm(
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

    questions2String(questions: Question[]) {
        let questionsString = questions.reduce((questionsStr, q) => {
            let qStr = `${q.id}: ${q.question}`;
            return questionsStr + "\n" + qStr;
        }, "");
        return questionsString;
    }

    documents2String(documents: Document[]) {
        let documentsString = documents.reduce((docStr, doc) => {
            return docStr + "\n" + doc.pageContent;
        }, "");
        return documentsString;
    }

    string2Questions(qString: string): Question[] {
        /** each question in the response string should be in this format
         * id: question?
         * This method converts string into array of type Question
         */
        let questionList = qString.split("\n");
        let questions = questionList.map((q) => {
            let [id, qStr] = q.split(".");
            let question: Question = {
                id: parseInt(id),
                question: qStr,
                status: "unanswered",
            };
            return question;
        });
        return questions;
    }

    async run() {
        let currentIter = 0;
        this.runModel.agentLifeCycle = "running";
        do {
            currentIter++;
            let currentQuestion = this.runModel.getCurrentQuestion();

            /** STEP 1
             * Generate context with current question.
             */
            let { answer: currentAnswer, sourceDocuments: currentDocuments } =
                await this.qaChain.call({
                    query: currentQuestion,
                });
            // For the first run, the answer should be added to the answerpad.
            if (currentIter == 1) {
                this.runModel.setAnswerpad(currentAnswer);
            }
            this.runModel.addDocuments(currentDocuments);
            console.log(currentQuestion, currentAnswer);

            /** STEP 2
             * Generate more questions.
             * using originalQuestion, currentDocuments as context and unansweredQuestions
             * Passing the numQuestions from mode settings
             */
            let startId = this.runModel.getLastQuestionId() + 1;
            let unansweredQuestions = this.questions2String(
                this.runModel.getUnansweredQuestions()
            );
            // Questions creation prompt call.
            let newQuestionsResponse = await this.questionCreationChain.predict(
                {
                    question: this.runModel.getOriginalQuestion(),
                    context: this.documents2String(currentDocuments),
                    unansweredQuestions,
                    numQuestions: this.modelSettings.numQuestionPerIter,
                    startId,
                }
            );
            let newQuestions = this.string2Questions(newQuestionsResponse);

            this.runModel.addQuestions(newQuestions);

            if (currentIter >= this.modelSettings.maxIter) {
                this.runModel.agentLifeCycle = "stopping";
            }
        } while (this.runModel.agentLifeCycle != "stopping");

        this.runModel.agentLifeCycle = "stopped";
    }
}
