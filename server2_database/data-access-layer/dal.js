const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.MY_SQL_HOST || "localhost",
    user: process.env.MY_SQL_USER || "root",
    password: process.env.MY_SQL_PASSWORD || "",
    database: process.env.MY_SQL_DATABASE || "wordStorage",
})

connection.connect(err => {
    if(err){
        console.error(err);
        return;
    }
    console.log(`=========== We're connected to "WordStorage" database on MySql ===========`);
})

function executeAsync(sql, values){
    return new Promise((resolve, reject)=>{
        connection.query(sql, values, (err, result)=>{
            if(err){
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

module.exports = {
    executeAsync
}