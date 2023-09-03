import { BaseChatModel } from "langchain/chat_models";
import {
    QA,
    ResearchCompiler,
    QuestionCreationChain,
    MostPertinentQuestion,
} from "./chains/index.js";


export class ResearchAgent {
    // Hyper parameters
    verbose = false;
    num_questions_per_iteration = 3
    question_creation_temperature = 0.5
    question_prioritisation_temperature = 0.5
    analyser_temperature = 0
    store = 'vector store'
    current_question_id: string | null = null;

    // scratchpad
    unansweredQuestions: object = {};
    answerpad = [];
    notes = [];
    currentDocuments = [];
    documents = [];
    answeredQuestions = [];

    // Chains
    qa: QA;
    researchCompiler: ResearchCompiler;
    questionCreationChain: QuestionCreationChain;
    mostPertinentQuestion: MostPertinentQuestion;

    constructor(
        qa: QA,
        researchCompiler: ResearchCompiler,
        questionCreationChain: QuestionCreationChain,
        mostPertinentQuestion: MostPertinentQuestion
    ) {
        this.qa = qa;
        this.researchCompiler = researchCompiler;
        this.questionCreationChain = questionCreationChain;
        this.mostPertinentQuestion = mostPertinentQuestion;
    }

    static fromLLM(llm: BaseChatModel): ResearchAgent {
        const qa = QA.from_llm(llm);
        const researchCompiler = ResearchCompiler.from_llm(llm);
        const questionCreationChain = QuestionCreationChain.from_llm(llm);
        const mostPertinentQuestion = MostPertinentQuestion.from_llm(llm);
        return new ResearchAgent(
            qa,
            researchCompiler,
            questionCreationChain,
            mostPertinentQuestion
        );
    }

    printUnansweredQuestions() {
        console.log('\x1b[95m\x1b[1m\n*****TASK LIST*****\n\x1b[0m\x1b[0m');
        Object.entries(this.unansweredQuestions).forEach(([k, v]) => console.log(`${k}: ${v}`));
    }
  
    printQuestion(question: string) {
        console.log('\x1b[92m\x1b[1m\n*****NEXT TASK*****\n\x1b[0m\x1b[0m');
        console.log(`${question}`);
    }
  
    printAnswer(answer: string) {
        console.log('\x1b[93m\x1b[1m\n*****TASK RESULT*****\n\x1b[0m\x1b[0m');
        console.log(answer);
    }

    async research(input: Record<string, any>): Promise<Record<string, any>> {
        const { question } = input;
        const { verbose } = input || false;
        const maxIterations = 6

        let firstRun = true;
        let currentIteration = 0
        let currentQuestion = question;
        while (true) {
            if (firstRun) {

            } else {

            }

        }

    }

}
