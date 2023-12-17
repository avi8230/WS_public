const Joi = require("joi");
const { min } = require("joi/lib/types/array");

class User {

    constructor(id, uuid, subscriptionId, role, deletingWords, name, email, password, date, emailVerification, temporaryPassword) {
        this.id = id;
        this.uuid = uuid;
        this.subscriptionId = subscriptionId;
        this.role = role;
        this.deletingWords = deletingWords;
        this.name = name;
        this.email = email;
        this.password = password;
        this.date = date;
        this.emailVerification = emailVerification;
        this.temporaryPassword = temporaryPassword;
    }

    validatePost() {
        const result = Joi.validate(this, User.postValidationScheme, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }

    validatePatch() {
        const result = Joi.validate(this, User.patchValidationScheme, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }

}

User.postValidationScheme = {
    id: Joi.number(),
    uuid: Joi.string().max(36).required(),
    subscriptionId: Joi.string().max(30).allow(''),
    role: Joi.number().required(),
    deletingWords: Joi.number(),
    name: Joi.string().max(100).allow(''),
    email: Joi.string().max(100).required().email(),
    password: Joi.string().min(4).max(300).required(),
    date: Joi.string().max(50).required(),
    emailVerification: Joi.number().required(),
    temporaryPassword: Joi.string().max(40).allow('')
}

User.patchValidationScheme = {
    id: Joi.number(),
    uuid: Joi.string().max(36).allow(''),
    subscriptionId: Joi.string().max(30).allow(''),
    role: Joi.number(),
    deletingWords: Joi.number(),
    name: Joi.string().max(100).allow(''),
    email: Joi.string().max(100).allow(''),
    password: Joi.string().min(4).max(300),
    date: Joi.string().max(50).allow(''),
    emailVerification: Joi.number(),
    temporaryPassword: Joi.string().max(40).allow('')
}

module.exports = User;