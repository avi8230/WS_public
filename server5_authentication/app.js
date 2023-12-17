try {
    // The path to the "example_words" folder varies by server.
    global.example_words_path = process.env.EXAMPLE_WORDS_PATH;

    const express = require("express");
    const cors = require("cors");
    const authController = require("./controllers/auth-controller");
    const passwordResetController = require("./controllers/passwordReset-controller");
    const server = express();

    server.use(express.json());
    server.use(cors());

    server.use("/api/auth", authController);
    server.use("/api/passwordReset", passwordResetController);


    server.use("*", (request, response) => {
        response.status(404).send("Route Not Found");
    })

    // Type to run: node app / npm start
    server.listen(3005, () => console.log("=========== server5_authentication. Listening on http://localhost:3005 ==========="));

}
catch (err) {
    console.log(err);
}