const express = require("express");
const sendPasswordLogic = require("../business-logic/sendPassword-logic");

const router = express.Router();

// Send Password ------------------------
router.post("/password/:to/:password", async (request, response) => {
    try {

        try {
            const to = request.params.to;
            const password = request.params.password;
            const subject = "Password - WordStorage";
            const html = sendPasswordLogic.getHtmlForPassword('register', password);

            const sendEmail = await sendPasswordLogic.sendEmailAsync(to, subject, html);
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

// Send Temporary Password ------------------------
router.post("/temporaryPassword/:to/:temporaryPassword", async (request, response) => {
    try {

        try {
            const to = request.params.to;
            const temporaryPassword = request.params.temporaryPassword;
            const subject = "Temporary Password - WordStorage";
            const html = sendPasswordLogic.getHtmlForPassword('temporary', temporaryPassword);

            const sendEmail = await sendPasswordLogic.sendEmailAsync(to, subject, html);
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

// Send New Password ------------------------
router.post("/newPassword/:to/:newPassword", async (request, response) => {
    try {

        try {
            const to = request.params.to;
            const newPassword = request.params.newPassword;
            const subject = "New Password - WordStorage";
            const html = sendPasswordLogic.getHtmlForPassword('new', newPassword);

            const sendEmail = await sendPasswordLogic.sendEmailAsync(to, subject, html);
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