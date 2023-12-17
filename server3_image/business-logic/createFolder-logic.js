const fs = require("fs");

function createFolderAsync(folderName) {
    return new Promise((resolve, reject) => {
        
        try {
            const path = `../../ws_assets/images/${folderName}`;

            fs.exists(path, function (exists) {
                if (exists) {
                    resolve(null);
                }
                else {

                    fs.mkdir(path, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve("The folder was created successfully.");
                        }
                    });

                }
            });

        }
        catch (err) {
            reject(err);
        }

    });

}

module.exports = {
    createFolderAsync
}