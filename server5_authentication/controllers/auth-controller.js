const express = require("express");
const config = require("../config.json");
const jwt = require("jsonwebtoken");
const authLogic = require("../business-logic/auth-logic");

const router = express.Router();

// Register ------------------------
router.post("/register", async (request, response) => {
    try {

        try {
            const user = await authLogic.registerAsync(request.body);
            delete user.id;
            delete user.subscriptionId;
            delete user.role;
            // delete user.password;
            delete user.emailVerification;
            response.status(201).send(user);
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

router.post("/deleteRegister/:waiting", async (request, response) => {
    try {

        try {
            const waiting = +request.params.waiting;
            const email = request.body.email;
            const password = request.body.password;

            const status = await authLogic.deleteUserAsync(waiting, email, password);
            response.sendStatus(status);
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

// Login ------------------------
router.post("/login", async (request, response) => {
    try {

        try {
            const user = await authLogic.loginAsync(request.body.email, request.body.password);

            if (user) {
                if (user.emailVerification === 0) {
                    await authLogic.createImageFolderAsync(user.uuid);
                    await authLogic.createAudioFolderAsync(user.uuid);
                    await authLogic.createPreferences(user.id);
                    await authLogic.createExampleWords(user.id, user.uuid);
                    await authLogic.updateEmailVerificationAsync(user.id);
                    authLogic.sendEmailToManager("avi8230@gmail.com", 'New User', `New User: ${user.email}`);
                }
                user.password = "";
                delete user.date;
                delete user.emailVerification;
                const token = jwt.sign({ user }, config.jwt.secretKey);
                response.json(token);
            }
        }
        catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    response.status(401).send("Incorrect Email or Password");
                }
                else {
                    response.status(err.response.status).send(`7: ${err.response.data}`);
                }
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

// verify Logged In------------------------
router.post("/verifyLoggedIn", async (request, response) => {
    try {

        try {
            const result = await authLogic.verifyLoggedInAsync(request.headers.authorization);

            if (result === 401) {
                response.status(result).send("You are not logged-in");
                return;
            }
            else if (result === 403) {
                response.status(result).send("Your login session has expired");
                return;
            }
            else {
                response.send(result);
            }
        }
        catch (err) {
            response.status(500).send(err.message);
        }

    }
    catch (err) {
        console.log(err);
    }
});

// Replace Token ------------------------
router.get("/replaceToken/:userId", async (request, response) => {
    try {

        try {
            const userId = request.params.userId;
            const user = await authLogic.getUser(userId);
            if (user) {
                user.password = "";
                delete user.date;
                delete user.emailVerification;
                const token = jwt.sign({ user }, config.jwt.secretKey);
                response.json(token);
            }
        }
        catch (err) {
            if (err.response) {
                if (err.response.status === 404) {
                    response.status(401).send("user does not exist.");
                }
                else {
                    response.status(err.response.status).send(`10: ${err.response.data}`);
                }
            }
            else if (err.request) {
                response.status(400).send(`11: ${err.message}`);
            }
            else {
                response.status(500).send(`12: ${err.message}`);
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;