const crypto = require("crypto");

const saltText = "kjh6e@#tdfv654s%dfg&6rg84dsfg%)(s656";

function hash(password) {
    return crypto.createHmac("sha512", saltText).update(password).digest("hex");
}

module.exports = hash;
