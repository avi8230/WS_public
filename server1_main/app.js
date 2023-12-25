try {
    // The purpose of this variable is to adjust the error messages, according to development/product mode.
    global.isProduction = process.env.IS_PRODUCTION === "true";

    const express = require("express");
    const expressRateLimit = require("express-rate-limit"); // npm i express-rate-limit
    const stripTags = require("./middleware/sanitize"); // Tag cleaner - for security purposes.
    const fileUpload = require("express-fileupload");
    const cors = require("cors");
    const getController = require("./controllers/get-controller");
    const addController = require("./controllers/add-controller");
    const updateController = require("./controllers/update-controller");
    const deleteController = require("./controllers/delete-controller");
    const preferencesController = require("./controllers/preferences-controller");
    const userController = require("./controllers/users-controller");
    const paymentController = require("./controllers/payment-controller");
    const translateController = require("./controllers/translate-controller");
    const wordToSentenceController = require("./controllers/wordToSentence-controller");
    const path = require('path');

    const server = express();

    // DDOS attack protection. (does not protect against "DDOS ip spoofing" attack)
    server.use("/", expressRateLimit({
        windowMs: 1000,
        max: 100,
        message: "Are you a hacker?"
    }));

    server.use(express.json());
    server.use(stripTags);
    server.use(fileUpload());
    server.use(cors()); // Cross Origin
    server.use(express.static(__dirname + "/../client_side/build")); // Defining a root directory // Same Origin

    // ---------------
    server.use("/api/users", userController);

    server.use("/api/words/get", getController);
    server.use("/api/words/add", addController);
    server.use("/api/words/update", updateController);
    server.use("/api/words/delete", deleteController);

    server.use("/api/preferences", preferencesController);

    server.use("/api/payment", paymentController);

    server.use("/api/translate", translateController);
    server.use("/api/word-to-sentence", wordToSentenceController);
    // ---------------

    // server.use("*", (request, response) => {
    //     response.status(404).send("error code: app---1. Route Not Found");
    // })

    server.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../client_side/build", 'index.html'));
    });
    // ---------------

    // Type to run: node app / npm start
    server.listen(3001, () => console.log("=========== server1_main. Listening on http://localhost:3001 ==========="));

}
catch (err) {
    console.log(err);
}