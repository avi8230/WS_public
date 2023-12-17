const dal = require("../data-access-layer/dal");
// ----------------------------------------------------------------------------------------------------------------
async function getAllWordsAsync(userId) {
    const sql = `SELECT 
           uuid, word, wordTranslation, sentence, sentenceTranslation, picture, speechWord, speechSentence, language, voice, highQuality, date, score, category 
           FROM words 
           WHERE userId = ?`;
    const words = await dal.executeAsync(sql, [userId]);
    return words;
}
// ----------------------------------------------------------------------------------------------------------------
async function getOneWordAsync(id) {

    const sql = `SELECT 
                    uuid, userId, word, wordTranslation, sentence, sentenceTranslation, picture, speechWord, speechSentence, language, voice, highQuality, date, score 
                    FROM words 
                    WHERE uuid = ?`;

    const words = await dal.executeAsync(sql, [id]);

    return words[0];
}
// ----------------------------------------------------------------------------------------------------------------
async function addWordAsync(word) {

    let sql = "INSERT INTO words(";
    const values = [];

    if (word.uuid !== undefined) {
        sql += `uuid,`;
        values.push(word.uuid);
    }
    if (word.userId !== undefined) {
        sql += `userId,`;
        values.push(word.userId);
    }
    if (word.word !== undefined) {
        sql += `word,`;
        values.push(word.word);
    }
    if (word.wordTranslation !== undefined) {
        sql += `wordTranslation,`;
        values.push(word.wordTranslation);
    }
    if (word.sentence !== undefined) {
        sql += `sentence,`;
        values.push(word.sentence);
    }
    if (word.sentenceTranslation !== undefined) {
        sql += `sentenceTranslation,`;
        values.push(word.sentenceTranslation);
    }
    if (word.picture !== undefined) {
        sql += `picture,`;
        values.push(word.picture);
    }
    if (word.speechWord !== undefined) {
        sql += `speechWord,`;
        values.push(word.speechWord);
    }
    if (word.speechSentence !== undefined) {
        sql += `speechSentence,`;
        values.push(word.speechSentence);
    }
    if (word.language !== undefined) {
        sql += `language,`;
        values.push(word.language);
    }
    if (word.voice !== undefined) {
        sql += `voice,`;
        values.push(word.voice);
    }
    if (word.highQuality !== undefined) {
        sql += `highQuality,`;
        values.push(word.highQuality);
    }
    if (word.date !== undefined) {
        sql += `date,`;
        values.push(word.date);
    }
    if (word.score !== undefined) {
        sql += `score,`;
        values.push(word.score);
    }
    if (word.category !== undefined) {
        sql += `category,`;
        values.push(word.category);
    }

    sql = sql.substring(0, sql.length - 1);

    sql += `) VALUES(`;

    if (word.uuid !== undefined) {
        sql += `?,`;
    }
    if (word.userId !== undefined) {
        sql += `?,`;
    }
    if (word.word !== undefined) {
        sql += `?,`;
    }
    if (word.wordTranslation !== undefined) {
        sql += `?,`;
    }
    if (word.sentence !== undefined) {
        sql += `?,`;
    }
    if (word.sentenceTranslation !== undefined) {
        sql += `?,`;
    }
    if (word.picture !== undefined) {
        sql += `?,`;
    }
    if (word.speechWord !== undefined) {
        sql += `?,`;
    }
    if (word.speechSentence !== undefined) {
        sql += `?,`;
    }
    if (word.language !== undefined) {
        sql += `?,`;
    }
    if (word.voice !== undefined) {
        sql += `?,`;
    }
    if (word.highQuality !== undefined) {
        sql += `?,`;
    }
    if (word.date !== undefined) {
        sql += `?,`;
    }
    if (word.score !== undefined) {
        sql += `?,`;
    }
    if (word.category !== undefined) {
        sql += `?,`;
    }

    sql = sql.substring(0, sql.length - 1);

    sql += `)`;

    values.push(word.id); // שורה זו נראית מיותרת

    const info = await dal.executeAsync(sql, values);

    word.id = info.insertId;
    return word;
}
// ----------------------------------------------------------------------------------------------------------------
async function updateFullWordAsync(word) {
    const sql = `UPDATE words SET 
                    userId = ?,
                    word = ?,
                    wordTranslation = ?,
                    sentence = ?,
                    sentenceTranslation = ?,
                    picture = ?,
                    speechWord = ?,
                    speechSentence = ?,
                    language = ?,
                    voice = ?,
                    highQuality = ?,
                    date = ?,
                    score = ?,
                    category = ? 
                    WHERE uuid = ?`;

                    const info = await dal.executeAsync(sql, [
        word.userId,
        word.word,
        word.wordTranslation,
        word.sentence,
        word.sentenceTranslation,
        word.picture,
        word.speechWord,
        word.speechSentence,
        word.language,
        word.voice,
        word.highQuality,
        word.date,
        word.score,
        word.category,
        word.uuid
    ]);

    return info.affectedRows > 0 ? word : null;
}
// ----------------------------------------------------------------------------------------------------------------
async function updatePartialWordAsync(word) {

    let sql = "UPDATE words SET ";
    const values = [];

    if (word.userId !== undefined) {
        sql += `userId = ?,`;
        values.push(word.userId);
    }
    if (word.word !== undefined) {
        sql += `word = ?,`;
        values.push(word.word);
    }
    if (word.wordTranslation !== undefined) {
        sql += `wordTranslation = ?,`;
        values.push(word.wordTranslation);
    }
    if (word.sentence !== undefined) {
        sql += `sentence = ?,`;
        values.push(word.sentence);
    }
    if (word.sentenceTranslation !== undefined) {
        sql += `sentenceTranslation = ?,`;
        values.push(word.sentenceTranslation);
    }
    if (word.picture !== undefined) {
        sql += `picture = ?,`;
        values.push(word.picture);
    }
    if (word.speechWord !== undefined) {
        sql += `speechWord = ?,`;
        values.push(word.speechWord);
    }
    if (word.speechSentence !== undefined) {
        sql += `speechSentence = ?,`;
        values.push(word.speechSentence);
    }
    if (word.language !== undefined) {
        sql += `language = ?,`;
        values.push(word.language);
    }
    if (word.voice !== undefined) {
        sql += `voice = ?,`;
        values.push(word.voice);
    }
    if (word.highQuality !== undefined) {
        sql += `highQuality = ?,`;
        values.push(word.highQuality);
    }
    if (word.date !== undefined) {
        sql += `date = ?,`;
        values.push(word.date);
    }
    if (word.score !== undefined) {
        sql += `score = ?,`;
        values.push(word.score);
    }

    sql = sql.substring(0, sql.length - 1);

    sql += ` WHERE uuid = ?`;
    values.push(word.uuid);

    const info = await dal.executeAsync(sql, values);
    return info.affectedRows > 0 ? word : null;
}
// ----------------------------------------------------------------------------------------------------------------
async function deleteWordAsync(uuid) {
    const sql = `DELETE FROM words WHERE uuid = ?`;
    await dal.executeAsync(sql, [uuid]);
}

async function deleteWordsAsync(userId) {
    const sql = `DELETE FROM words WHERE userId = ?`;
    await dal.executeAsync(sql, [userId]);
}
// ----------------------------------------------------------------------------------------------------------------
module.exports = {
    getAllWordsAsync,
    getOneWordAsync,
    addWordAsync,
    updateFullWordAsync,
    updatePartialWordAsync,
    deleteWordAsync,
    deleteWordsAsync,
}