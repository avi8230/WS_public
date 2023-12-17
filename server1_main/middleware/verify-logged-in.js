const axios = require("axios");

async function verifyLoggedIn(request, response, next) {
    try {

        try {
            const result = await axios({
                url: "http://localhost:3005/api/auth/verifyLoggedIn",
                method: 'POST',
                headers: {
                    'authorization': request.headers.authorization
                }
            });

            if (result.status === 200) {
                const user = result.data.user;

                // ========== Blocking access to a user whose trial period has expired and is also not a subscriber.
                const address = request.originalUrl;
                if (address.includes("words") || address.includes("preferences")) {

                    let role = await axios({
                        url: `http://localhost:3002/api/users/user/role/${user.id}`,
                        method: 'GET'
                    });

                    role = role.data;

                    if (role == 2 || role == 5) {
                        response.status(403).send('You are not subscribed to a website.');
                        return;
                    }
                }
                // ==========

                request.user = user;
                next();
            }
        }
        catch (err) {
            if (err.response) {
                if (isProduction) {
                    response.status(err.response.status).send(`error code: verify-1.`);
                }
                else {
                    response.status(err.response.status).send(`error code: verify-logged-in---1. A response was received from the server --> ${err.response.data}`);
                }
            }
            else if (err.request) {
                if (isProduction) {
                    response.status(400).send(`error code: verify-2.`);
                }
                else {
                    response.status(400).send(`error code: verify-logged-in---2. The request was sent, but no response was received from the server --> ${err.message}`);
                }
            }
            else {
                if (isProduction) {
                    response.status(500).send(`error code: verify-3.`);
                }
                else {
                    response.status(500).send(`error code: verify-logged-in---3. The request was not sent, because of an error in the request settings, or because of some other server error --> ${err.message}`);
                }
            }
        }

    }
    catch (err) {
        console.log(err);
    }
}

module.exports = verifyLoggedIn;