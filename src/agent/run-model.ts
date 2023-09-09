import { Document } from "langchain/document";
import { v4 } from "uuid";

export type AgentLifecycle =
    | "starting"
    | "running"
    | "stopping"
    | "stopped"
    | "completed";

export type QuestionStatus = "answered" | "unanswered" | "current";

export type Question = {
    id: number;
    question: string;
    status: QuestionStatus;
    answer?: string;
};

type runStore = {
    id: string;
    originalQuestion: string;
    questions: Question[];
    answerpad: string;
    documents: Document[];
};

interface RunModel {
    getId(): string;

    getOriginalQuestion(): string;

    getLifecycle(): AgentLifecycle;

    getUnansweredQuestions(): Question[];

    getAnsweredQuestions(): Question[];

    getAllQuestions(): Question[];

    getCurrentQuestionString(): string;

    setCurrentQuestion(question: Question): void;

    setCurrentAnswer(answer: string): void;

    getLastQuestionId(): number; // so the next set of questions have unique ids.

    addQuestions(questions: Question[]): void;

    addDocuments(documents: Document[]): void;

    setAnswerpad(answer: string): void;
}

export class AgentRunModel implements RunModel {
    run: runStore;
    agentLifeCycle: AgentLifecycle;
    currentQuestion: Question | undefined = undefined;

    constructor(originalQuestion: string) {
        this.run = {
            id: v4().toString(),
            originalQuestion: originalQuestion,
            questions: [],
            answerpad: "",
            documents: [],
        };
        this.agentLifeCycle = "running";
    }

    getId() {
        return this.run.id;
    }

    getOriginalQuestion(): string {
        return this.run.originalQuestion;
    }

    getLifecycle(): AgentLifecycle {
        return this.agentLifeCycle;
    }

    getAnsweredQuestions(): Question[] {
        // filter answered questions
        let answeredQuestions = this.run.questions.filter((q) => {
            return q.status == "answered";
        });
        return answeredQuestions;
    }

    getUnansweredQuestions(): Question[] {
        let unansweredQuestions = this.run.questions.filter((q) => {
            return q.status == "unanswered";
        });
        return unansweredQuestions;
    }

    getAllQuestions(): Question[] {
        return this.run.questions;
    }

    getCurrentQuestionString(): string {
        return this.currentQuestion?.question || this.run.originalQuestion;
    }

    setCurrentQuestion(question: Question): void {
        this.currentQuestion = question;
        // consider the current question to be answered
        let index = this.run.questions.findIndex((q) => q.id == question.id);
        this.run.questions[index].status = "answered";
    }

    setCurrentAnswer(answer: string): void {
        const questionId = this.currentQuestion?.id;
        if (questionId) {
            let index = this.run.questions.findIndex((q) => q.id == questionId);
            this.run.questions[index].answer = answer;
        } else {
            console.error("Current Question id not found");
        }
    }

    addQuestions(questions: Question[]): void {
        this.run.questions.push(...questions);
    }

    getLastQuestionId(): number {
        if (this.run.questions.length == 0) return 0;
        let lastQ = this.run.questions.slice(-1)[0];
        return lastQ.id;
    }

    addDocuments(documents: Document[]): void {
        this.run.documents.push(...documents);
    }

    setAnswerpad(answer: string): void {
        this.run.answerpad = answer;
    }
}
