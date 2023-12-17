const express = require("express");
const axios = require("axios");
const uuid_v = require("uuid");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const updateLogic = require("../business-logic/update-logic");
const addLogic = require("../business-logic/add-logic");
const deleteLogic = require("../business-logic/delete-logic");

const router = express.Router();
router.use(verifyLoggedIn);

router.put("/:uuid", async (request, response) => {
    try {

        let exceptionPoint = 0;
        let uuid;
        let oldWord;
        let newWord;

        try {
            // Updating a word in the database.
            uuid = request.params.uuid;
            oldWord = await deleteLogic.getOneWordAsync(uuid);

            if (oldWord.userId !== request.user.id) {
                response.sendStatus(404);
                return;
            }

            let userId = oldWord.userId;
            let word = request.body.word;
            let wordTranslation = request.body.wordTranslation;
            let sentence = request.body.sentence;
            let sentenceTranslation = request.body.sentenceTranslation;
            let picture = oldWord.picture;
            let speechWord = oldWord.speechWord;
            let speechSentence = oldWord.speechSentence;
            let language = request.body.language;
            let voice = request.body.voice;
            let highQuality = request.body.highQuality > 0 ? 1 : 0;
            let date = oldWord.date;
            let score = oldWord.score;
            let category = request.body.category;

            if (request.files) {
                const imageToSave = request.files.myImage;
                const extension = imageToSave.name.substr(imageToSave.name.lastIndexOf("."));
                const fileName = uuid_v.v4() + extension;
                picture = fileName;
            }

            let speechWordChanged = false;
            if (updateLogic.differentStrings(word, oldWord.word) ||
                updateLogic.differentStrings(language, oldWord.language) ||
                updateLogic.differentStrings(voice, oldWord.voice) ||
                updateLogic.differentStrings(highQuality, oldWord.highQuality)) {
                if (word) { speechWord = uuid_v.v4() + '.wav'; }
                else { speechWord = ""; }
                speechWordChanged = true;
            }

            let speechSentenceChanged = false;
            if (updateLogic.differentStrings(sentence, oldWord.sentence) ||
                updateLogic.differentStrings(language, oldWord.language) ||
                updateLogic.differentStrings(voice, oldWord.voice) ||
                updateLogic.differentStrings(highQuality, oldWord.highQuality)) {
                if (sentence) { speechSentence = uuid_v.v4() + '.wav'; }
                else { speechSentence = ""; }
                speechSentenceChanged = true;
            }

            newWord = {
                userId,
                word,
                wordTranslation,
                sentence,
                sentenceTranslation,
                picture,
                speechWord,
                speechSentence,
                language,
                voice,
                highQuality,
                date,
                score,
                category
            }

            const updatedWord = await updateLogic.updatedWordAsync(uuid, newWord);
            exceptionPoint = 1;
            let result = `The word "${updatedWord.word}" has been successfully updated, uuid=${updatedWord.uuid}. `;

            // Saving the image.
            if (request.files) {
                if (oldWord.picture) {
                    await deleteLogic.deleteImageAsync(request.user.uuid, oldWord.picture);
                }
                exceptionPoint = 2;
                let imageToSave = request.files.myImage;
                imageToSave.name = picture;
                result += "\n" + await addLogic.saveImageAsync(request.user.uuid, imageToSave) + " ";
            }
            exceptionPoint = 3;

            // Creating audio files.
            if (speechWordChanged) {
                if (oldWord.speechWord) {
                    await deleteLogic.deleteAudioAsync(request.user.uuid, oldWord.speechWord);
                }
                exceptionPoint = 4;
                if (word) {
                    result += "\nword: " + await addLogic.saveAudioAsync(word, language, voice, highQuality, request.user.uuid, speechWord) + " ";
                }
            }
            exceptionPoint = 5;

            if (speechSentenceChanged) {
                if (oldWord.speechSentence) {
                    await deleteLogic.deleteAudioAsync(request.user.uuid, oldWord.speechSentence);
                }
                exceptionPoint = 6;
                if (sentence) {
                    result += "\nsentence: " + await addLogic.saveAudioAsync(sentence, language, voice, highQuality, request.user.uuid, speechSentence) + " ";
                }
            }

            if (isProduction) {
                // response.status(200).send(`The word "${updatedWord.word}" has been successfully updated.`);
                
                delete updatedWord.id;
                delete updatedWord.userId; 
                response.status(201).json(updatedWord);
            }
            else {
                // response.status(200).send(result);

                delete updatedWord.id;
                delete updatedWord.userId; 
                response.status(201).json(updatedWord);
            }
        }
        catch (err) {
            if (err.response) {
                if (isProduction) {
                    response.status(err.response.status).send(`error code: update-1.`);
                }
                else {
                    response.status(err.response.status).send(`error code: update-controller---1. A response was received from the server. --> ${err.response.data}`);
                }
            }
            else if (err.request) {
                if (isProduction) {
                    response.status(400).send(`error code: update-2.`);
                }
                else {
                    response.status(400).send(`error code: update-controller---2. The request was sent, but no response was received from the server. --> ${err.message}`);
                }
            }
            else {  
                if (isProduction) {
                    response.status(500).send(`error code: update-3.`);
                }
                else {
                    response.status(500).send(`error code: update-controller---3. The request was not sent, because of an error in the request settings, or because of some other server error. --> ${err.message}`);
                }
            }

            try {
                switch (exceptionPoint) {
                    case 1: { // saved In Database
                        await updateLogic.updatedWordAsync(uuid, oldWord);
                    }
                        break;
                    case 2: { // image Deleted
                        oldWord.picture = "";
                        await updateLogic.updatedWordAsync(uuid, oldWord);
                    }
                        break;
                    case 3: { // image Saved
                        oldWord.picture = newWord.picture;
                        await updateLogic.updatedWordAsync(uuid, oldWord);
                    }
                        break;
                    case 4: { // speechWord Deleted
                        oldWord.picture = newWord.picture;
                        oldWord.speechWord = "";
                        await updateLogic.updatedWordAsync(uuid, oldWord);
                    }
                        break;
                    case 5: { // speechWord Saved
                        newWord.sentence = oldWord.sentence;
                        newWord.sentenceTranslation = oldWord.sentenceTranslation;
                        newWord.speechSentence = oldWord.speechSentence;
                        await updateLogic.updatedWordAsync(uuid, newWord);
                    }
                        break;
                    case 6: { // speechSentence Deleted
                        newWord.sentence = oldWord.sentence;
                        newWord.sentenceTranslation = oldWord.sentenceTranslation;
                        newWord.speechSentence = "";
                        await updateLogic.updatedWordAsync(uuid, newWord);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});

// Update Score ----------------------------------------------------------
router.patch("/score/:uuid/:score", verifyLoggedIn, async (request, response) => {
    try {

        try {
            const uuid = request.params.uuid;
            const score = request.params.score;

            const resultScore = await axios.patch(`http://localhost:3002/api/words/${uuid}`, { score });
            const updateScore = resultScore.data.score;

            response.send(updateScore);
        }
        catch (err) {
            if (err.response) {
                if (isProduction) {
                    response.status(err.response.status).send(`error code: update-4.`);
                }
                else {
                    response.status(err.response.status).send(`error code: update-controller---4. A response was received from the server --> ${err.response.data}`);
                }
            }
            else if (err.request) {
                if (isProduction) {
                    response.status(400).send(`error code: update-5.`);
                }
                else {
                    response.status(400).send(`error code: update-controller---5. The request was sent, but no response was received from the server --> ${err.message}`);
                }
            }
            else {
                if (isProduction) {
                    response.status(500).send(`error code: update-6.`);
                }
                else {
                    response.status(500).send(`error code: update-controller---6. The request was not sent, because of an error in the request settings, or because of some other server error --> ${err.message}`);
                }
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});


module.exports = router;