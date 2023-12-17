const express = require("express");
const preferencesLogic = require("../business-logic/preferences-logic");
const Preferences = require("../models/preferences");

const router = express.Router();

// 1.Get one preferences -----------------------------------------------------------------------------------------
router.get("/:userId", async (request, response) => {
    try {

        try {
            const userId = request.params.userId;

            const preferences = await preferencesLogic.getOnePreferencesAsync(userId);
            if (!preferences) {
                response.sendStatus(404);
                return;
            }
            response.json(preferences);
        }
        catch (err) {
            response.status(500).send(err.message);
        }

    }
    catch (err) {
        console.log(err);
    }
});

// 2.Add new preferences -----------------------------------------------------------------------------------------
router.post("/", async (request, response) => {
    try {

        try {
            const preferences = new Preferences(
                undefined,
                request.body.userId,
                request.body.rateSpeech,
                request.body.language,
                request.body.voice,
                request.body.highQuality
            );

            const errors = preferences.validatePost();
            if (errors) {
                response.status(400).send(errors);
                return;
            }

            const addPreferences = await preferencesLogic.addPreferencesAsync(preferences);
            response.status(201).json(addPreferences);
        }
        catch (err) {
            response.status(500).send(err.message);
        }
        
    }
    catch (err) {
        console.log(err);
    }
});

// 3.Update partial preferences -----------------------------------------------------------------------------------------
router.patch("/:userId", async (request, response) => {
    try {

        try {
            const preferences = new Preferences(
                undefined,
                +request.params.userId,
                request.body.rateSpeech,
                request.body.language,
                request.body.voice,
                request.body.highQuality,
            );

            const errors = preferences.validatePatch();
            if (errors) {
                response.status(400).send(errors);
                return;
            }

            const updatePreferences = await preferencesLogic.updatePartialPreferencesAsync(preferences);
            if (!updatePreferences) {
                response.sendStatus(404);
                return;
            }

            response.json(updatePreferences);
        }
        catch (err) {
            response.status(500).send(err.message);
        }

    }
    catch (err) {
        console.log(err);
    }
});

// 4.Delete preferences -----------------------------------------------------------------------------------------
router.delete("/:userId", async (request, response) => {
    try {

        try {
            const userId = +request.params.userId;
            await preferencesLogic.deletePreferencesAsync(userId);
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