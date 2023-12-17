// const Joi = require("joi");

class Text{

    constructor(text, language, voice, highQuality, folderName, fileName){
        this.text = text;
        this.language = language;
        this.voice = voice;
        this.highQuality = highQuality;
        this.folderName = folderName;
        this.fileName = fileName;
    };

    // validate(){
    //     return null;
    // }

}

module.exports = Text;