// https://www.npmjs.com/package/generate-password
const generator = require('generate-password');

function generatePassword() {
    const password = generator.generate({
        length: 10,
        numbers: true,
        excludeSimilarCharacters: true
    });
    return (password);
}

module.exports = generatePassword;
