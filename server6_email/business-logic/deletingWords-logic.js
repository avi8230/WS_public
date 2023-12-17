const nodemailer = require('nodemailer');

async function sendEmailAsync(to, subject, html) {
    return new Promise(async (resolve, reject) => {
        try {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject,
                html
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve('Email sent: ' + info.response);
                }
            });

        }
        catch (err) {
            reject(err);
        }
    });
}

// Generate HTML --------------------------
function getHtmlForDeletingWords(days_to_delete_the_words) {
    return `

    <!DOCTYPE html>
    <html lang="en">
    
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Leckerli One">

    <style>
        body {
            font-family: 'Montserrat', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }

        h1 {
            font-size: 25px;
            font-weight: 100;
            margin: 0;
        }

        p {
            margin: 7px 0 5px 0;
            font-size: 20px;
            font-weight: 100;
        }
    </style>
</head>

<!-- --------------------------------------------------------------------------------------- -->

<body>
    <h1>Warning before deleting your words from the "WordStorage" website.</h1>
    <p>You are no longer subscribed to the "WordStorage" website.</p>
    <p> In ${days_to_delete_the_words} days, all the words you have written will be deleted.</p>
    <p>Subscriptions can be renewed at the following link: <a href="http://34.201.172.175/payment"><b>Renewal Of Subscriptions</b></a>.</p>
    <br>
    <br>
    <a href="http://wordstorage.com">wordstorage.com</a>
</body>

    </html>    
       
    `;
}

module.exports = {
    sendEmailAsync,
    getHtmlForDeletingWords
};
