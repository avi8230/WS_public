const Joi = require("joi");

class Word {

    constructor(id, uuid, userId, word, wordTranslation, sentence, sentenceTranslation, picture, speechWord, speechSentence, language, voice, highQuality, date, score, category) {
        this.id = id;
        this.uuid = uuid;
        this.userId = userId;
        this.word = word;
        this.wordTranslation = wordTranslation;
        this.sentence = sentence;
        this.sentenceTranslation = sentenceTranslation;
        this.picture = picture;
        this.speechWord = speechWord;
        this.speechSentence = speechSentence;
        this.language = language;
        this.voice = voice;
        this.highQuality = highQuality;
        this.date = date;
        this.score = score;
        this.category = category;
    }

    validatePost() {
        const result = Joi.validate(this, Word.postValidationScheme, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }

    validatePut() {
        const result = Joi.validate(this, Word.putValidationScheme, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }

    validatePatch() {
        const result = Joi.validate(this, Word.patchValidationScheme, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }

}

Word.postValidationScheme = {
    id: Joi.number(),
    uuid: Joi.string().max(36).required(),
    userId: Joi.number().required(),
    word: Joi.string().max(100).required(),
    wordTranslation: Joi.string().max(100).allow(''),
    sentence: Joi.string().max(1000).allow(''),
    sentenceTranslation: Joi.string().max(1000).allow(''),
    picture: Joi.string().allow(''),
    speechWord: Joi.string().allow(''),
    speechSentence: Joi.string().allow(''),
    language: Joi.string().allow(''),
    voice: Joi.string().allow(''),
    highQuality: Joi.number(),
    date: Joi.string().required(),
    score: Joi.number().min(0).max(10),
    category: Joi.string().max(20).allow('')
}

Word.putValidationScheme = {
    id: Joi.number(),
    uuid: Joi.string().max(36).required(),
    userId: Joi.number().required(),
    word: Joi.string().max(100).required(),
    wordTranslation: Joi.string().max(100).allow(''),
    sentence: Joi.string().max(1000).allow(''),
    sentenceTranslation: Joi.string().max(1000).allow(''),
    picture: Joi.string().allow(''),
    speechWord: Joi.string().allow(''),
    speechSentence: Joi.string().allow(''),
    language: Joi.string().allow(''),
    voice: Joi.string().allow(''),
    highQuality: Joi.number(),
    date: Joi.string().required(),
    score: Joi.number().min(0).max(10),
    category: Joi.string().max(20).allow('')
}

Word.patchValidationScheme = {
    id: Joi.number(),
    uuid: Joi.string().max(36).allow(''),
    userId: Joi.number(),
    word: Joi.string().max(100),
    wordTranslation: Joi.string().max(100).allow(''),
    sentence: Joi.string().max(1000).allow(''),
    sentenceTranslation: Joi.string().max(1000).allow(''),
    picture: Joi.string().allow(''),
    speechWord: Joi.string().allow(''),
    speechSentence: Joi.string().allow(''),
    language: Joi.string().allow(''),
    voice: Joi.string().allow(''),
    highQuality: Joi.number().allow(''),
    date: Joi.string().allow(''),
    score: Joi.number().min(0).max(10),
    category: Joi.string().max(20).allow('')
}

module.exports = Word;