const express = require("express");
const passwordResetLogic = require("../business-logic/passwordReset-logic");

const router = express.Router();

// Step One ------------------------
router.post("/stepOne/:email", async (request, response) => {
    try {

        try {
            const email = request.params.email;
            const temporaryPassword = await passwordResetLogic.updateTemporaryPasswordAsync(email);
            response.status(200).send(temporaryPassword);
        }
        catch (err) {
            if (err.response) {
                response.status(err.response.status).send(`1: ${err.response.data}`);
            }
            else if (err.request) {
                response.status(400).send(`2: ${err.message}`);
            }
            else {
                response.status(500).send(`3: ${err.message}`);
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});

// Delete Step One ------------------------
router.post("/deleteStepOne/:waiting/:email", async (request, response) => {
    try {

        try {
            const waiting = +request.params.waiting;
            const email = request.params.email;
            const result = await passwordResetLogic.deleteTemporaryPasswordAsync(waiting, email);
            response.sendStatus(result.status);
        }
        catch (err) {
            if (err.response) {
                response.status(err.response.status).send(`4: ${err.response.data}`);
            }
            else if (err.request) {
                response.status(400).send(`5: ${err.message}`);
            }
            else {
                response.status(500).send(`6: ${err.message}`);
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});

// Step Two ------------------------
router.post("/stepTwo/:email/:temporaryPassword", async (request, response) => {
    try {

        try {
            const email = request.params.email;
            const temporaryPassword = request.params.temporaryPassword;
            const password = await passwordResetLogic.updatePasswordAsync(email, temporaryPassword);
            response.status(200).send(password);
        }
        catch (err) {
            if (err.response) {
                response.status(err.response.status).send(`7: ${err.response.data}`);
            }
            else if (err.request) {
                response.status(400).send(`8: ${err.message}`);
            }
            else {
                response.status(500).send(`9: ${err.message}`);
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;