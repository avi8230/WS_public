const stripTags = require("striptags");

function sanitize(request, response, next) {
    for(const property in request.body) {
        if(typeof request.body[property] === "string") {
            request.body[property] = stripTags(request.body[property]);
        }
    }
    next();
}

module.exports = sanitize;