import {
    iterationColor,
    nextQuestionColor,
    unansweredQuestionsColor,
    thoughtColor,
    errorColor,
    answerColor,
    finalAsnwerColor,
    questionsColor,
    questionListColor,
} from "./colors.js";

export const logThought = function (outPut: any, iter?: number | string) {
    if (iter) console.log(iterationColor(`[${iter}]`));
    console.log(thoughtColor(outPut));
};
export const logQuestions = function (outPut: any, iter?: number | string) {
    if (iter) console.log(iterationColor(`[${iter}]`));
    console.log(questionsColor(outPut));
};
export const logAnswer = function (outPut: any, iter?: number | string) {
    if (iter) console.log(iterationColor(`[${iter}]`));
    console.log(answerColor(outPut));
};
export const logFinalAnswer = function (outPut: any, iter?: number | string) {
    if (iter) console.log(iterationColor(`[${iter}]`));
    console.log(finalAsnwerColor(outPut));
};
export const logIteration = function (outPut: any, iter?: number | string) {
    if (iter) console.log(iterationColor(`[${iter}]`));
    console.log(iterationColor(outPut));
};
export const logError = function (outPut: any, iter?: number | string) {
    if (iter) console.log(iterationColor(`[${iter}]`));
    console.log(errorColor(outPut));
};
export const logNextQuestion = function (outPut: any, iter?: number | string) {
    if (iter) console.log(iterationColor(`[${iter}]`));
    console.log(nextQuestionColor(outPut));
};
export const logQuestionList = function (outPut: any, iter?: number | string) {
    if (iter) console.log(iterationColor(`[${iter}]`));
    console.log(questionListColor(outPut));
};
