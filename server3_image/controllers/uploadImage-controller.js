const express = require("express");
const uploadImageLogic = require("../business-logic/uploadImage-logic");

const router = express.Router();

router.post("/:folderName", async (request, response) => {
    try {

        try {
            if (!request.files) {
                response.status(400).send("No image sent.");
                return;
            }

            const folderName = request.params.folderName;
            const file = request.files.myImage;

            const result = await uploadImageLogic.uploadImageAsync(folderName, file);

            if (result) {
                response.status(201).send(result);
            }
            else {
                response.status(400).send("No image sent, or folder does not exist.");
            }

        }
        catch (err) {
            response.status(500).send(`Exception in Server. ${err}`);
        }

    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;