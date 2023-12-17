const fs = require("fs");

function uploadImageAsync(folderName, file) {
    return new Promise((resolve, reject) => {
        try {

            if (!file) {
                resolve(null);
                return;
            }

            fs.exists(`../../ws_assets/images/${folderName}`, function (exists) {
                if (exists) {
                    const path = `../../ws_assets/images/${folderName}/${file.name}`;
                    file.mv(path);
                    resolve("Image saved successfully.");
                }
                else {
                    resolve(null);
                }
            });

        }
        catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    uploadImageAsync
}