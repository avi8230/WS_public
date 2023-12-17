const axios = require("axios");

// -----------------------------------------------------
function getOneWordAsync(uuid) {
    return new Promise(async (resolve, reject) => {
        try {

            const word = await axios({
                url: `http://localhost:3002/api/words/one/${uuid}`,
                method: 'GET',
            });
    
            resolve(word.data);

        }
        catch (err) {
            reject(err);
        }
    });
}
// -----------------------------------------------------
function deleteImageAsync(folderName, fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            
            await axios({
                url: `http://localhost:3003/api/delete/image/${folderName}/${fileName}`,
                method: 'DELETE'
            });

            resolve();

        }
        catch (err) {
            reject(err);
        }
    });
}
// -----------------------------------------------------
function deleteAudioAsync(folderName, fileName) {
    return new Promise(async (resolve, reject) => {
        try {

            await axios({
                url: `http://localhost:3004/api/delete/audio/${folderName}/${fileName}`,
                method: 'DELETE'
            });

            resolve();

        }
        catch (err) {
            reject(err);
        }
    });
}
// -----------------------------------------------------
function deleteWordAsync(uuid) {
    return new Promise(async (resolve, reject) => {
        try {

            await axios({
                url: `http://localhost:3002/api/words/${uuid}`,
                method: 'DELETE'
            });

            resolve();

        }
        catch (err) {
            reject(err);
        }
    });
}
// -----------------------------------------------------
module.exports = {
    getOneWordAsync,
    deleteImageAsync,
    deleteAudioAsync,
    deleteWordAsync
}