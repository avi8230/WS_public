try {

    const express = require("express");
    const cors = require("cors");
    const sendPasswordController = require("./controllers/sendPassword-controller");
    const deletingWordsController = require("./controllers/deletingWords-controller");
    const managerController = require("./controllers/manager-controller");
    const server = express();

    server.use(express.json());
    server.use(cors());

    server.use("/api/send-password", sendPasswordController);
    server.use("/api/send-email-before-deleting", deletingWordsController);
    server.use("/api/send-email-to-manager", managerController);
 
    server.use("*", (request, response) => {
        response.status(404).send("Route Not Found");
    })

    // Type to run: node app / npm start
    server.listen(3006, () => console.log("=========== server6_email. Listening on http://localhost:3006 ==========="));

}
catch (err) {
    console.log(err);
}