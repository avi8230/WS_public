const express = require("express");
const uuid_v = require("uuid");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const addLogic = require("../business-logic/add-logic");
const updateLogic = require("../business-logic/update-logic");

const router = express.Router();
router.use(verifyLoggedIn);

router.post("/", async (request, response) => {
    try {

        let exceptionPoint = 0;
        let newWord;
        let addWord;

        try {
            // Creating a word in the database.
            let uuid = uuid_v.v4();
            let userId = request.user.id;
            let word = request.body.word;
            let wordTranslation = request.body.wordTranslation;
            let sentence = request.body.sentence;
            let sentenceTranslation = request.body.sentenceTranslation;
            let picture;
            let speechWord;
            let speechSentence;
            let language = request.body.language;
            let voice = request.body.voice;
            let highQuality = request.body.highQuality > 0 ? 1 : 0;
            let score = 0;
            let category = request.body.category;

            let d = new Date().toJSON().slice(0, 10);
            let t = new Date().toJSON().slice(11, 19);
            let date = `${d} ${t}`;

            if (word) { speechWord = uuid_v.v4() + '.wav'; }
            if (sentence) { speechSentence = uuid_v.v4() + '.wav'; }

            if (request.files) {
                const imageToSave = request.files.myImage;
                const extension = imageToSave.name.substr(imageToSave.name.lastIndexOf("."));
                const fileName = uuid_v.v4() + extension;
                picture = fileName;
            }

            newWord = {
                uuid,
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

            addWord = await addLogic.saveWordAsync(newWord);
            exceptionPoint = 1;
            let result = `The word "${addWord.word}" has been successfully added, id=${addWord.id}. `;

            // Saving the image.
            if (request.files) {
                let imageToSave = request.files.myImage;
                imageToSave.name = picture;
                result += "\n" + await addLogic.saveImageAsync(request.user.uuid, imageToSave) + " ";
            }
            exceptionPoint = 2;

            // Creating audio files.
            if (word) { result += "\nword: " + await addLogic.saveAudioAsync(word, language, voice, highQuality, request.user.uuid, speechWord) + " "; }
            exceptionPoint = 3;
            if (sentence) { result += "\nsentence: " + await addLogic.saveAudioAsync(sentence, language, voice, highQuality, request.user.uuid, speechSentence) + " "; }

            if (isProduction) {
                // response.status(201).send(`The word "${addWord.word}" has been successfully added.`);

                delete addWord.id;
                delete addWord.userId; 
                response.status(201).json(addWord);
            }
            else {
                // response.status(201).send(result);

                delete addWord.id;
                delete addWord.userId; 
                response.status(201).json(addWord);
            }
        }
        catch (err) {
            if (err.response) {
                if (isProduction) {
                    response.status(err.response.status).send(`error code: add-1.`);
                }
                else {
                    response.status(err.response.status).send(`error code: add-controller---1. A response was received from the server. --> ${err.response.data}`);
                }
            }
            else if (err.request) {
                if (isProduction) {
                    response.status(400).send(`error code: add-2.`);
                }
                else {
                    response.status(400).send(`error code: add-controller---2. The request was sent, but no response was received from the server. --> ${err.message}`);
                }
            }
            else {
                if (isProduction) {
                    response.status(500).send(`error code: add-3.`);
                }
                else {
                    response.status(500).send(`error code: add-controller---3. The request was not sent, because of an error in the request settings, or because of some other server error. --> ${err.message}`);
                }
            }

            try {
                switch (exceptionPoint) {
                    case 1: { // saved In Database
                        addWord.picture = "";
                        addWord.speechWord = "";
                        addWord.speechSentence = "";
                        addWord.language = "";
                        addWord.voice = "";
                        addWord.highQuality = 0;
                        await updateLogic.updatedWordAsync(addWord.uuid, addWord);
                    }
                        break;
                    case 2: { // image Saved
                        addWord.speechWord = "";
                        addWord.speechSentence = "";
                        addWord.language = "";
                        addWord.voice = "";
                        addWord.highQuality = 0;
                        await updateLogic.updatedWordAsync(addWord.uuid, addWord);
                    }
                        break;
                    case 3: { // speechWord Saved
                        addWord.speechSentence = "";
                        await updateLogic.updatedWordAsync(addWord.uuid, addWord);
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        
    }
    catch (err) {
        // console.log(e.message);
        console.log(err);
    }
});

module.exports = router;