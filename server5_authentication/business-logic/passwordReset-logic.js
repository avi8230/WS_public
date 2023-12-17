const axios = require("axios");
const hashing = require("../helpers/hashing");
const generatePassword = require("../helpers/generatePassword");

async function updateTemporaryPasswordAsync(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const temporaryPassword = generatePassword();
            const result = await axios.patch(`http://localhost:3002/api/users/updateTemporaryPassword/${email}/${hashing(temporaryPassword)}`);
            if (result.status === 200) {
                resolve(temporaryPassword);
            }
        }
        catch (err) {
            reject(err);
        }
    });
}

async function deleteTemporaryPasswordAsync(waiting, email) {
    return new Promise(async (resolve, reject) => {
        try {
            setTimeout(async () => {

                try {
                    const result = await axios.patch(`http://localhost:3002/api/users/deleteTemporaryPassword/${email}`);
                    resolve(result);
                }
                catch (err) {
                    reject(err);
                }

            }, waiting, email);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function updatePasswordAsync(email, temporaryPassword) {
    return new Promise(async (resolve, reject) => {
        try {
            const password = generatePassword();
            const result = await axios.patch(`http://localhost:3002/api/users/updatePassword/${email}/${hashing(temporaryPassword)}/${hashing(password)}`);
            if (result.status === 200) {
                resolve(password);
            }
        }
        catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    updateTemporaryPasswordAsync,
    deleteTemporaryPasswordAsync,
    updatePasswordAsync
};