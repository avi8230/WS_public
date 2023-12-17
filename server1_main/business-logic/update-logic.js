const axios = require("axios");

// -----------------------------------------------------
function differentStrings(str1, str2){
    return String(str1).localeCompare(String(str2)) !== 0;
}
// -----------------------------------------------------
function updatedWordAsync(uuid, word) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axios.put(`http://localhost:3002/api/words/${uuid}`, word);
            resolve(result.data);
        }
        catch (err) {
            reject(err);
        }
    });
}
// -----------------------------------------------------

module.exports = {
    differentStrings,
    updatedWordAsync
}