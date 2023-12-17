const express = require("express");
const createFolderLogic = require("../business-logic/createFolder-logic");

const router = express.Router();

router.post("/:folderName", async (request, response) => {
    try {

        try {

            const folderName = request.params.folderName;
            const result = await createFolderLogic.createFolderAsync(folderName);

            if (result) {
                response.status(201).send(result);
            }
            else {
                response.status(400).send("The folder already exists.");
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