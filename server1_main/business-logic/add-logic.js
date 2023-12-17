const axios = require("axios");
const FormData = require('form-data');

// -----------------------------------------------------
function saveWordAsync(word) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axios.post('http://localhost:3002/api/words', word);
            resolve(result.data);
        }
        catch (err) {
            reject(err);
        }
    });
}
// -----------------------------------------------------
function saveImageAsync(folderName, image) {
    return new Promise(async (resolve, reject) => {
        try {
            // Create a form and append image
            const form = new FormData();
            form.append('myImage', image.data, image.name);

            // Send form data with axios
            const result = await axios.post(`http://localhost:3003/api/uploadImage/${folderName}`, form, {
                headers: {
                    ...form.getHeaders(),
                },
            });

            resolve(result.data);
        }
        catch (err) {
            reject(err);
        }
    });
}
// -----------------------------------------------------
function saveAudioAsync(text, language, voice, highQuality, folderName, fileName) {
    return new Promise(async (resolve, reject) => {
        try {

            const txt = {
                text,
                language,
                voice,
                highQuality,
                folderName,
                fileName
            }

            const result = await axios.post('http://localhost:3004/api/textToSpeech', txt);
            resolve(result.data);

        }
        catch (err) {
            reject(err);
        }
    });
}
// -----------------------------------------------------

module.exports = {
    saveImageAsync,
    saveAudioAsync,
    saveWordAsync
}