interface WordModel {
    uuid: string;

    word: string;
    wordTranslation: string;
    sentence: string;
    sentenceTranslation: string;

    picture: string;
    myImage: File; // This field does not exist in the database.

    speechWord: string;
    speechSentence: string;

    language: string;
    voice: string;
    highQuality: number;

    date: string;
    score: number;
    category: string;

    display: boolean; // This field does not exist in the database.
}

export default WordModel;