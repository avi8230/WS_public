const express = require("express");
const deleteLogic = require("../business-logic/delete-logic");

const router = express.Router();

router.delete("/image/:folderName/:fileName", async (request, response) => {
    try {

        try {
            const folderName = request.params.folderName;
            const fileName = request.params.fileName;
            const err = await deleteLogic.deleteImageAsync(folderName, fileName);

            if (!err) {
                // With code 204 it is not possible to send information in the response body.
                response.sendStatus(204);
            }
            else {
                response.status(404).send(`The image does not exist. ${err}`);
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

router.delete("/folder/:folderName", async (request, response) => {
    try {

        try {
            const folderName = request.params.folderName;
            await deleteLogic.deleteFolderAsync(folderName);
            response.sendStatus(204);
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