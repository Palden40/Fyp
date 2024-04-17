const { z } = require('zod');

const nonemptyString = z.string().trim().nonempty();

const fillValueSchema = z.object({
    placeholder: nonemptyString,
    value: nonemptyString,
});

const fillQuizSchema = z.object({
    sentence: nonemptyString,
    values: z.array(fillValueSchema).min(1),
});

const puzzleSchema = z.object({
    title: nonemptyString,
    tips: z.string(),
    category: nonemptyString,
    instruction: nonemptyString,
    complexity: nonemptyString,
    fillBlank: fillQuizSchema,
});

const createPuzzleSchema = z.object({
    body: puzzleSchema,
});

const updatePuzzleSchema = z.object({
    body: puzzleSchema.omit({ fillBlank: true }).partial(),
});

const createPuzzleFillBlankSchema = z.object({
    body: fillQuizSchema,
});

const updatePuzzleFillBlankSchema = z.object({
    body: fillQuizSchema.deepPartial(),
});

const checkAnswerSchema = z.object({
    body: fillQuizSchema.omit({ sentence: true }),
});

module.exports = {
    createPuzzleSchema,
    updatePuzzleSchema,
    createPuzzleFillBlankSchema,
    updatePuzzleFillBlankSchema,
    checkAnswerSchema,
};
