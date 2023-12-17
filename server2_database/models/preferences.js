const Joi = require("joi");

class Preferences {

    constructor(id, userId, rateSpeech, language, voice, highQuality) {
        this.id = id;
        this.userId = userId;
        this.rateSpeech = rateSpeech;
        this.language = language;
        this.voice = voice;
        this.highQuality = highQuality;
    }

    validatePost() {
        const result = Joi.validate(this, Preferences.postValidationScheme, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }

    validatePatch() {
        const result = Joi.validate(this, Preferences.patchValidationScheme, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }

}

Preferences.postValidationScheme = {
    id: Joi.number(),
    userId: Joi.number().required(),
    rateSpeech: Joi.number().required(),
    language: Joi.string().max(50).required(),
    voice: Joi.string().max(50).required(),
    highQuality: Joi.number().required(),
}

Preferences.patchValidationScheme = {
    id: Joi.number(),
    userId: Joi.number().required().allow(''),
    rateSpeech: Joi.number(),
    language: Joi.string().max(50).allow(''),
    voice: Joi.string().max(50).allow(''),
    highQuality: Joi.number(),
}

module.exports = Preferences;