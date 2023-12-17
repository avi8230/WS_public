const dal = require("../data-access-layer/dal");

// 1 ----------------------------------------------------------------------------------------
async function getOnePreferencesAsync(userId) {

    const sql = `SELECT *
                 FROM preferences 
                 WHERE userId = ?`;

    const preferences = await dal.executeAsync(sql, [userId]);

    return preferences[0];
}
// 2 ----------------------------------------------------------------------------------------
async function addPreferencesAsync(preferences) {

    const sql = `INSERT INTO 
                    preferences(userId, rateSpeech, language, voice, highQuality) 
                    VALUES(?, ?, ?, ?, ?)`;

    const info = await dal.executeAsync(sql, [
        preferences.userId,
        preferences.rateSpeech,
        preferences.language,
        preferences.voice,
        preferences.highQuality,
    ]);

    preferences.id = info.insertId;
    return preferences;
}

// 3 ----------------------------------------------------------------------------------------
async function updatePartialPreferencesAsync(preferences) {

    const values = [];
    let sql = `UPDATE preferences SET `;
    for (const key in preferences) {
        if (preferences[key] !== undefined && key !== "userId") {
            sql += `${key} = ?,`;
            values.push(preferences[key]);
        }
    }
    sql = sql.substring(0, sql.length - 1);
    sql += ` WHERE userId = ?`;
    values.push(preferences.userId);

    const info = await dal.executeAsync(sql, values);
    return info.affectedRows > 0 ? preferences : null;
}
// 4 ----------------------------------------------------------------------------------------
async function deletePreferencesAsync(userId) {

    const sql = `DELETE FROM preferences WHERE userId = ?`;
    await dal.executeAsync(sql, [userId]);
}
//----------------------------------------------------------------------------------------------------------------
module.exports = {
    getOnePreferencesAsync,
    addPreferencesAsync,
    updatePartialPreferencesAsync,
    deletePreferencesAsync
}