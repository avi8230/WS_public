const axios = require("axios");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("../config.json");
const hashing = require("../helpers/hashing");
const generatePassword = require("../helpers/generatePassword");
const fs = require('fs');
const exampleWordsModule = require("./exampleWords.js");

// Register ------------------------------------------------------------------------
async function registerAsync(user) {
    return new Promise(async (resolve, reject) => {
        try {
            user.uuid = uuid.v4();
            user.role = 1;
            user.deletingWords = 60;
            user.name = user.email.slice(0, user.email.indexOf('@')).slice(0, 8);
            let password = generatePassword();
            user.password = hashing(password);
            let d = new Date().toJSON().slice(0, 10);
            let t = new Date().toJSON().slice(11, 19);
            user.date = `${d} ${t}`;
            user.emailVerification = 0;

            const addUser = await axios.post('http://localhost:3002/api/users', user);
            addUser.data.password = password;
            resolve(addUser.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function deleteUserAsync(waiting, email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            setTimeout(async () => {

                try {
                    let user = await axios.get(`http://localhost:3002/api/users/${email}/${hashing(password)}`);
                    user = user.data;

                    if (user.emailVerification === 0) {
                        const result = await axios.delete(`http://localhost:3002/api/users/${user.id}`);
                        resolve(result.status);
                    }
                    resolve(200);
                }
                catch (err) {
                    reject(err);
                }

            }, waiting, email, password);
        }
        catch (err) {
            reject(err);
        }
    });
}

// Login ------------------------------------------------------------------------
async function loginAsync(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await axios.get(`http://localhost:3002/api/users/${email}/${hashing(password)}`);
            resolve(user.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function createImageFolderAsync(folderName) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axios.post(`http://localhost:3003/api/createFolder/${folderName}`);
            resolve(result.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function createAudioFolderAsync(folderName) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axios.post(`http://localhost:3004/api/createFolder/${folderName}`);
            resolve(result.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function createPreferences(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const preferences = {
                "userId": id,
                "rateSpeech": 1,
                "language": "en-US",
                "voice": "en-US-JennyMultilingualNeural",
                "highQuality": 0
            }
            const addPreferences = await axios.post(`http://localhost:3002/api/preferences`, preferences);
            resolve(addPreferences.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function getPreferences(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const preferences = await axios.get(`http://localhost:3002/api/preferences/${id}`);
            resolve(preferences.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function updateEmailVerificationAsync(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const updateUser = await axios.patch(`http://localhost:3002/api/users/${id}`, { 'emailVerification': 1 });
            resolve(updateUser.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function createExampleWords(userId, userUuid) {
    return new Promise(async (resolve, reject) => {

        try {
            // Adding words into the database --------------------------------------
            // Preparing the words
            let exampleWordsArray = exampleWordsModule.exampleWords;

            exampleWordsArray.forEach(async (word, index) => {
                try {
                    word.uuid = uuid.v4();

                    word.userId = userId;
                    
                    let d = new Date().toJSON().slice(0, 10);
                    let secondsAbs = Math.abs(index - 13);
                    let seconds = secondsAbs < 10 ? '0' + secondsAbs : secondsAbs;
                    let t = new Date().toJSON().slice(11, 17) + seconds;
                    word.date = `${d} ${t}`;
                }
                catch (err) {
                    console.log(err);
                }
            });

            // Add to database
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[0]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[1]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[2]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[3]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[4]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[5]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[6]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[7]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[8]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[9]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[10]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[11]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[12]);
            await axios.post('http://localhost:3002/api/words', exampleWordsArray[13]);
            
            // Copying the files --------------------------------------
            // images
            const source_images = `${example_words_path}/ws_assets/example_words/images`;
            const destination_images = `${example_words_path}/ws_assets/images/${userUuid}`;
            fs.cp(source_images, destination_images, { recursive: true }, (err) => { if (err) reject(err); });

            // audio_words
            const source_audioWords = `${example_words_path}/ws_assets/example_words/audio_words`;
            const destination_audioWords = `${example_words_path}/ws_assets/audio/${userUuid}`;
            fs.cp(source_audioWords, destination_audioWords, { recursive: true }, (err) => { if (err) reject(err); });

            // audio_sentences
            const source_audioSentences = `${example_words_path}/ws_assets/example_words/audio_sentences`;
            const destination_audioSentences = `${example_words_path}/ws_assets/audio/${userUuid}`;
            fs.cp(source_audioSentences, destination_audioSentences, { recursive: true }, (err) => { if (err) reject(err); });

            // --------------------------------------
            resolve();
        }
        catch (err) {
            reject(err);
        }
    });
}

// verify Logged In ------------------------------------------------------------------------
async function verifyLoggedInAsync(authorization) {
    return new Promise(async (resolve, reject) => {
        try {

            if (!authorization) {
                resolve(401);
            }
            // authorization: Bearer my-token
            const token = authorization.split(" ")[1];

            if (!token) {
                resolve(401);
            }

            jwt.verify(token, config.jwt.secretKey, (err, payload) => {

                if (err) {
                    if (err.message === "jwt expired") {
                        resolve(403);
                    }
                    resolve(401);
                }

                resolve(payload);
            });

        }
        catch (err) {
            reject(err);
        }
    });
}

// Replace Token ------------------------------------------------------------------------
async function getUser(userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await axios.get(`http://localhost:3002/api/users/${userId}`);
            resolve(user.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

// Send Email To Manager -----------------------------------------------------------------
async function sendEmailToManager(email, subject, message) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axios.post(`http://localhost:3006/api/send-email-to-manager/${email}/${subject}/${message}`);
            if (result.status === 200)
                resolve(true);
            resolve(false);
        }
        catch (err) {
            reject(err);
        }
    });
}

// ------------------------
module.exports = {
    registerAsync,
    deleteUserAsync,
    loginAsync,
    createImageFolderAsync,
    createAudioFolderAsync,
    createPreferences,
    getPreferences,
    updateEmailVerificationAsync,
    createExampleWords,
    verifyLoggedInAsync,
    getUser,
    sendEmailToManager
};