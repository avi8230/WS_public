const express = require("express");
const TTSLogic = require("../business-logic/TTS-logic");
const Text = require("../models/text");

const router = express.Router();

router.post("/", async (request, response) => {
    try {

        try {
            const text = new Text(
                request.body.text,
                request.body.language,
                request.body.voice,
                request.body.highQuality,
                request.body.folderName,
                request.body.fileName,
            );

            // const errors = text.validate();
            // if (errors) {
            //     response.status(400).send(errors);
            //     return;
            // }

            const result = await TTSLogic.textToSpeechAsync(text);

            // Conversion completed successfully.
            if (result === 10) {
                response.status(201).send(`synthesis finished.`);
            }

            // The conversion started but was canceled, because of an error in the query sent to Microsoft.
            else {
                response.status(400).send(`synthesis canceled. ${result}`);
            }
        }

        // The conversion didn't start at all, because of an error on my server, or on Microsoft's server.
        catch (err) {
            response.status(500).send(`not started synthesis. ${err}`);
        }

    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;