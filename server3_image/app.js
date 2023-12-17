try {

    const express = require("express");
    const cors = require("cors");
    const fileUpload = require("express-fileupload");

    const createFolderController = require("./controllers/createFolder-controller");
    const uploadImageController = require("./controllers/uploadImage-controller")
    const showImageController = require("./controllers/showImage-controller")
    const deleteController = require("./controllers/delete-controller");

    const server = express();

    server.use(cors());
    server.use(fileUpload());

    server.use("/api/createFolder", createFolderController);
    server.use("/api/uploadImage", uploadImageController);
    server.use("/api/showImage", showImageController);
    server.use("/api/delete", deleteController);

    server.use("*", (request, response) => {
        response.status(404).send("Route Not Found");
    })

    // Type to run: node app / npm start
    server.listen(3003, () => console.log("=========== server3_image. Listening on http://localhost:3003 ==========="));

}
catch (err) {
    console.log(err);
}