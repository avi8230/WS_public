try {
    
    const express = require("express");
    const cors = require("cors");
    const wordsController = require("./controllers/words-controller");
    const usersController = require("./controllers/users-controller");
    const preferencesController = require("./controllers/preferences-controller");

    const server = express();

    server.use(express.json()); // Take the body values into request.body object.
    server.use(cors());

    server.use("/api/words", wordsController);
    server.use("/api/users", usersController);
    server.use("/api/preferences", preferencesController);



    server.use("*", (request, response) => {
        response.status(404).send("Route Not Found");
    })

    // Type to run: node app / npm start
    server.listen(3002, () => console.log("=========== server2_database. Listening on http://localhost:3002 ==========="));

}
catch(err){
    console.log(err);
}