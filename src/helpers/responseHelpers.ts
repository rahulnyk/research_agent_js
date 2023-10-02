import { Question, QuestionStatus, QuestionType } from "../agent/run-model.js";
import { Document } from "langchain/document";
import { logError } from "./agentLogger.js";

export function string2Questions(
    qString: string,
    status?: QuestionStatus,
    type?: QuestionType,
): Question[] {
    /** each question in the response string should be in this format
     * id: question?
     * This method converts string into array of type Question
     */
    let questionList = qString.trim().split("\n");
    
    let questions = questionList.flatMap((q) => {
        // console.log(q);
        try {
            /** Splitting the response by '.' or ':'
             * because LLM randomly outputs any of these
             * Probably need to tune the prompt tightly to avoide ':'
             */
            let [id, qStr] = q.split(/[:.]+/);
            let question: Question = {
                id: parseInt(id),
                question: qStr.trim(),
                status: status || "unanswered",
                type: type || 'hop'
            };
            return question;
        } catch (e) {
            logError(qString);
            logError(e);
            return [];
        }
    });
    return questions;
}

export function questions2PromptString(questions: Question[]) {
    let questionsString = questions.reduce((questionsStr, q) => {
        let qStr = `'${q.id}. ${q.question}',`;
        return qStr + questionsStr;
    }, "");
    return "[" + questionsString + "]";
}

export function documents2String(documents: Document[]) {
    let documentsString = documents.reduce((docStr, doc) => {
        return docStr + "\n" + doc.pageContent;
    }, "");
    return documentsString;
}

export function qA2PromptString(questions: Question[]): string {
    /**
     * this method compiles all the answered questions into a string
     * The string format:
     * "Questions - question?\n Answer - answer  \n"
     * This is used to stuff the compiler prompt with context
     */
    let answers = questions.reduce((c, q) => {
        return c + `{Question: ${q.question}, Answer: ${q.answer}}`
    }, '')
    return "[" + answers + "]";
}