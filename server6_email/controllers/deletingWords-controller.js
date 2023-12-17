const express = require("express");
const deletingWordsLogic = require("../business-logic/deletingWords-logic");

const router = express.Router();

// Send Password ------------------------
router.post("/:to/:days", async (request, response) => {

    try {

        try {
            const to = request.params.to;
            const days_to_delete_the_words = request.params.days;

            const subject = "Warning Before Deleting Words.";
            const html = deletingWordsLogic.getHtmlForDeletingWords(days_to_delete_the_words);

            const sendEmail = await deletingWordsLogic.sendEmailAsync(to, subject, html);
            response.status(200).send(sendEmail);
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