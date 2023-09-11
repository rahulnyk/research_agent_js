import { Question, QuestionStatus } from "../agent/run-model.js";
import { Document } from "langchain/document";
import { logError } from "./agentLogger.js";

export function string2Questions(
    qString: string,
    status: QuestionStatus
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
                status: "unanswered",
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

export function questions2String(questions: Question[]) {
    let questionsString = questions.reduce((questionsStr, q) => {
        let qStr = `${q.id}: ${q.question}`;
        return questionsStr + "\n" + qStr;
    }, "");
    return questionsString;
}

export function documents2String(documents: Document[]) {
    let documentsString = documents.reduce((docStr, doc) => {
        return docStr + "\n" + doc.pageContent;
    }, "");
    return documentsString;
}
