const express = require("express");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const deleteLogic = require("../business-logic/delete-logic");
const updateLogic = require("../business-logic/update-logic");

const router = express.Router();
router.use(verifyLoggedIn);

router.delete("/:uuid", async (request, response) => {
    try {

        let exceptionPoint = 0;
        let word;

        try {
            word = await deleteLogic.getOneWordAsync(request.params.uuid);
            if (word && word.userId === request.user.id) {
                if (word.picture) { await deleteLogic.deleteImageAsync(request.user.uuid, word.picture); }
                exceptionPoint = 1;
                if (word.speechWord) { await deleteLogic.deleteAudioAsync(request.user.uuid, word.speechWord); }
                exceptionPoint = 2;
                if (word.speechSentence) { await deleteLogic.deleteAudioAsync(request.user.uuid, word.speechSentence); }
                exceptionPoint = 3;
                await deleteLogic.deleteWordAsync(word.uuid);
                
                response.sendStatus(204);
            }
            else {
                response.sendStatus(404);
            }
        }
        catch (err) {
            if (err.response) {
                if (isProduction) {
                    response.status(err.response.status).send(`error code: delete-1.`);
                }
                else {
                    response.status(err.response.status).send(`error code: delete-controller---1. A response was received from the server. --> ${err.response.data}`);
                }
            }
            else if (err.request) {
                if (isProduction) {
                    response.status(400).send(`error code: delete-2.`);
                }
                else {
                    response.status(400).send(`error code: delete-controller---2. The request was sent, but no response was received from the server. --> ${err.message}`);
                }
            }
            else {
                if (isProduction) {
                    response.status(500).send(`error code: delete-3.`);
                }
                else {
                    response.status(500).send(`error code: delete-controller---3. The request was not sent, because of an error in the request settings, or because of some other server error. --> ${err.message}`);
                }
            }

            try {
                switch (exceptionPoint) {
                    case 1: { // Deleted image
                        word.picture = "";
                        await updateLogic.updatedWordAsync(word.uuid, word);
                    }
                        break;
                    case 2: { // Deleted speechWord
                        word.picture = "";
                        word.speechWord = "";
                        await updateLogic.updatedWordAsync(word.uuid, word);
                    }
                        break;
                    case 3: { // Deleted speechSentence
                        word.picture = "";
                        word.speechWord = "";
                        word.speechSentence = "";
                        word.language = "";
                        word.voice = "";
                        word.highQuality = 0;
                        await updateLogic.updatedWordAsync(word.uuid, word);
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

module.exports = router;