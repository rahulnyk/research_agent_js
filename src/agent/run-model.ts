import { Document } from "langchain/document";
import { v4 } from "uuid";

export type AgentLifecycle =
    | "starting"
    | "running"
    | "stopping"
    | "stopped"
    | "completed";

export type QuestionStatus = "answered" | "unanswered" | "current";
export type QuestionType = 'hop' | 'subquestion';

export type Question = {
    id: number;
    question: string;
    status: QuestionStatus;
    type?: QuestionType;
    answer?: string;
    documents?: Document[];
};

type runStore = {
    id: string;
    originalQuestion: string;
    questions: Question[];
    finalAnswer: string | undefined;
};

interface RunModel {
    getId(): string;

    getOriginalQuestion(): string;

    getLifecycle(): AgentLifecycle;

    getUnansweredQuestions(): Question[];

    getAnsweredQuestions(): Question[];

    getAllQuestions(): Question[];

    getLastQuestionId(): number; // so the next set of questions have unique ids.

    addQuestions(questions: Question[]): void;

    setFinalAnswer(answer: string): void;

    setCurrentQuestion(id: number): void;

    getCurrentQuestion(): Question;

    setAnswer(id: number, q: Omit<Question, 'question' | 'status' | 'id'>): void;
}

export class AgentRunModel implements RunModel {
    run: runStore;
    agentLifeCycle: AgentLifecycle;

    constructor(originalQuestion: string) {
        this.run = {
            id: v4().toString(),
            originalQuestion: originalQuestion,
            questions: [],
            finalAnswer: undefined,
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

    setCurrentQuestion(id: number): void {
        let index = this.run.questions.findIndex((q) => q.id == id);
        this.run.questions[index].status = "current";
    }

    getCurrentQuestion(): Question {
        let index = this.run.questions.findIndex((q) => q.status == 'current');
        return this.run.questions[index]
    }

    setAnswer(id: number, answer: Omit<Question, "question" | "status" | "id">): void {
        let index = this.run.questions.findIndex((q) => q.id == id);
        this.run.questions[index] = {...this.run.questions[index], ...answer, status: 'answered'}
    }


    // getCurrentQuestionString(): string {
    //     return this.currentQuestion?.question || this.run.originalQuestion;
    // }

    // setCurrentQuestion(question: Question): void {
    //     this.currentQuestion = question;
    //     // consider the current question to be answered
    //     let index = this.run.questions.findIndex((q) => q.id == question.id);
    //     this.run.questions[index].status = "answered";
    // }

    // setCurrentAnswer(answer: string): void {
    //     const questionId = this.currentQuestion?.id;
    //     if (questionId) {
    //         let index = this.run.questions.findIndex((q) => q.id == questionId);
    //         this.run.questions[index].answer = answer;
    //     } else {
    //         console.error("Current Question id not found");
    //     }
    // }

    addQuestions(questions: Question[]): void {
        this.run.questions.push(...questions);
    }

    getLastQuestionId(): number {
        if (this.run.questions.length == 0) return 0;
        let lastQ = this.run.questions.slice(-1)[0];
        return lastQ.id;
    }

    setFinalAnswer(answer: string): void {
        this.run.finalAnswer = answer;
    }
}
