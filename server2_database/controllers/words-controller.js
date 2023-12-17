const express = require("express");
const wordsLogic = require("../business-logic/words-logic");
const Word = require("../models/word");

const router = express.Router();

// ----------------------------------------------------------------------------------------------------------------
router.get("/:userId", async (request, response) => {
    try {
        try {
            const userId = request.params.userId;
            const words = await wordsLogic.getAllWordsAsync(userId);
            response.json(words);
        }
        catch (err) {
            response.status(500).send(err.message);
        }

    }
    catch (err) {
        console.log(err);
    }
});
// ----------------------------------------------------------------------------------------------------------------
router.get("/one/:uuid", async (request, response) => {
    try {

        try {
            const uuid = request.params.uuid;

            const word = await wordsLogic.getOneWordAsync(uuid);
            if (!word) {
                response.sendStatus(404);
                return;
            }
            response.json(word);
        }
        catch (err) {
            response.status(500).send(err.message);
        }

    }
    catch (err) {
        console.log(err);
    }
});
// ----------------------------------------------------------------------------------------------------------------
router.post("/", async (request, response) => {
    try {

        try {
            const word = new Word(
                undefined,
                request.body.uuid,
                request.body.userId,
                request.body.word,
                request.body.wordTranslation,
                request.body.sentence,
                request.body.sentenceTranslation,
                request.body.picture,
                request.body.speechWord,
                request.body.speechSentence,
                request.body.language,
                request.body.voice,
                request.body.highQuality,
                request.body.date,
                request.body.score,
                request.body.category
            );

            const errors = word.validatePost();
            if (errors) {
                response.status(400).send(errors);
                return;
            }

            const addWord = await wordsLogic.addWordAsync(word);
            response.status(201).json(addWord);
        }
        catch (err) {
            response.status(500).send(err.message);
        }

    }
    catch (err) {
        console.log(err);
    }
});
// ----------------------------------------------------------------------------------------------------------------
router.put("/:uuid", async (request, response) => {
    try {

        try {
            const word = new Word(
                undefined,
                request.params.uuid,
                request.body.userId,
                request.body.word,
                request.body.wordTranslation,
                request.body.sentence,
                request.body.sentenceTranslation,
                request.body.picture,
                request.body.speechWord,
                request.body.speechSentence,
                request.body.language,
                request.body.voice,
                request.body.highQuality,
                request.body.date,
                request.body.score,
                request.body.category,
            );

            const errors = word.validatePut();
            if (errors) {
                response.status(400).send(errors);
                return;
            }

            const updateWords = await wordsLogic.updateFullWordAsync(word);
            if (!updateWords) {
                response.sendStatus(404);
                return;
            }

            response.json(updateWords);
        }
        catch (err) {
            response.status(500).send(err.message);
        }

    }
    catch (err) {
        console.log(err);
    }
});
// ----------------------------------------------------------------------------------------------------------------
router.patch("/:uuid", async (request, response) => {
    try {

        try {
            const word = new Word(
                undefined,
                request.params.uuid,
                request.body.userId,
                request.body.word,
                request.body.wordTranslation,
                request.body.sentence,
                request.body.sentenceTranslation,
                request.body.picture,
                request.body.speechWord,
                request.body.speechSentence,
                request.body.language,
                request.body.voice,
                request.body.highQuality,
                request.body.date,
                request.body.score,
                request.body.category,
            );

            const errors = word.validatePatch();
            if (errors) {
                response.status(400).send(errors);
                return;
            }

            const updateWord = await wordsLogic.updatePartialWordAsync(word);
            if (!updateWord) {
                response.sendStatus(404);
                return;
            }

            response.json(updateWord);
        }
        catch (err) {
            response.status(500).send(err.message);
        }

    }
    catch (err) {
        console.log(err);
    }
});
// ----------------------------------------------------------------------------------------------------------------
router.delete("/:uuid", async (request, response) => {
    try {

        try {
            const uuid = request.params.uuid;
            await wordsLogic.deleteWordAsync(uuid);
            response.sendStatus(204);
        }
        catch (err) {
            response.status(500).send(err.message);
        }

    }
    catch (err) {
        console.log(err);
    }
});
// ----------------------------------------------------------------------------------------------------------------
router.delete("/delete-all-words/:userId", async (request, response) => {
    try {

        try {
            const userId = request.params.userId;
            await wordsLogic.deleteWordsAsync(userId);
            response.sendStatus(204);
        }
        catch (err) {
            response.status(500).send(err.message);
        }

    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;