const express = require("express");
const axios = require("axios");
const verifyLoggedIn = require("../middleware/verify-logged-in");

const router = express.Router();

// --------------------------------------------------------------------------------------------------------
router.get("/", verifyLoggedIn, async (request, response) => {
    try {

        try {
            const resultPreferences = await axios.get(`http://localhost:3002/api/preferences/${request.user.id}`);
            const preferences = resultPreferences.data;
            delete preferences.id;
            delete preferences.userId;
            response.json(preferences);
        }
        catch (err) {
            if (err.response) {
                if (isProduction) {
                    response.status(err.response.status).send(`error code: preferences-1.`);
                }
                else {
                    response.status(err.response.status).send(`error code: preferences-controllers---1. A response was received from the server --> ${err.response.data}`);
                }
            }
            else if (err.request) {
                if (isProduction) {
                    response.status(400).send(`error code: preferences-2.`);
                }
                else {
                    response.status(400).send(`error code: preferences-controllers---2. The request was sent, but no response was received from the server --> ${err.message}`);
                }
            }
            else {
                if (isProduction) {
                    response.status(500).send(`error code: preferences-3.`);
                }
                else {
                    response.status(500).send(`error code: preferences-controllers---3. The request was not sent, because of an error in the request settings, or because of some other server error --> ${err.message}`);
                }
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});

router.patch("/", verifyLoggedIn, async (request, response) => {
    try {

        try {
            let preferences = {
                'rateSpeech': request.body.rateSpeech,
                'language': request.body.language,
                'voice': request.body.voice,
                'highQuality': request.body.highQuality
            }

            const resultPreferences = await axios.patch(`http://localhost:3002/api/preferences/${request.user.id}`, preferences);
            preferences = resultPreferences.data;
            delete preferences.id;
            delete preferences.userId;

            response.json(preferences);
        }
        catch (err) {
            if (err.response) {
                if (isProduction) {
                    response.status(err.response.status).send(`error code: preferences-4.`);
                }
                else {
                    response.status(err.response.status).send(`error code: preferences-controllers---4. A response was received from the server --> ${err.response.data}`);
                }
            }
            else if (err.request) {
                if (isProduction) {
                    response.status(400).send(`error code: preferences-5.`);
                }
                else {
                    response.status(400).send(`error code: preferences-controllers---5. The request was sent, but no response was received from the server --> ${err.message}`);
                }
            }
            else {
                if (isProduction) {
                    response.status(500).send(`error code: preferences-6.`);
                }
                else {
                    response.status(500).send(`error code: preferences-controllers---6. The request was not sent, because of an error in the request settings, or because of some other server error --> ${err.message}`);
                }
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;