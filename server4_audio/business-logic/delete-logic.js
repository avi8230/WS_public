const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require('path');

function deleteAudioAsync(folderName, fileName) {
    return new Promise((resolve, reject) => {
        
        try {
            const path = `../../ws_assets/audio/${folderName}/${fileName}`;

            fs.unlink(path, (err) => {
                if (err) {
                    resolve(err)
                }
                else {
                    resolve(null);
                }
            })

        }
        catch (err) {
            reject(err);
        }

    });

}

// https://bobbyhadz.com/blog/delete-all-files-in-a-directory-using-node-js
function deleteFolderAsync(folderName) {
    return new Promise(async (resolve, reject) => {
        try {
            const folderPath = `../../ws_assets/audio/${folderName}`;
            const files = await fsPromises.readdir(folderPath);

            const deleteFilePromises = files.map(file =>
                fsPromises.unlink(path.join(folderPath, file)),
            );

            await Promise.all(deleteFilePromises);
            resolve();

        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    deleteAudioAsync,
    deleteFolderAsync
}