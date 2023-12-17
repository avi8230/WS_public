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
function getHtmlForPassword(template, password) {

    let header;
    let p;

    switch (template) {
        case 'register':
            header = 'Welcome to "WordStorage"!';
            p = 'Your password is:';
            break;
        case 'temporary':
            header = 'Reset your WordStorage password.';
            p = 'The temporary password is:';
            break;
        case 'new':
            header = 'Your password has been successfully updated!';
            p = 'Your new password is:';
            break;
    }

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
    
<body>
    <h1>${header}</h1>
    <p>${p} ${password}</p>
    <br>
    <a href="http://wordstorage.com">wordstorage.com</a>
</body>

    </html>    
       
    `;
}

module.exports = {
    sendEmailAsync,
    getHtmlForPassword
};
