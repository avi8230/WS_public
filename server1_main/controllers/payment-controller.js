const express = require("express");
const axios = require("axios");
const verifyLoggedIn = require("../middleware/verify-logged-in");

const router = express.Router();
router.use(verifyLoggedIn);

// --------------------------------------------------------------------------------------------------------
router.post("/create-subscription", async (request, response) => {
    try {

        try {
            const result = await axios.post(`http://localhost:3007/api/create-subscription`);
            const data = result.data;
            response.status(result.status).json(data);
        }
        catch (err) {
            if (err.response) {
                if (isProduction) {
                    response.status(err.response.status).send(`error code: payment-1.`);
                }
                else {
                    response.status(err.response.status).send(`error code: payment-controllers---1. A response was received from the server --> ${err.response.data}`);
                }
            }
            else if (err.request) {
                if (isProduction) {
                    response.status(400).send(`error code: payment-2.`);
                }
                else {
                    response.status(400).send(`error code: payment-controllers---2. The request was sent, but no response was received from the server --> ${err.message}`);
                }
            }
            else {
                if (isProduction) {
                    response.status(500).send(`error code: payment-3.`);
                }
                else {
                    response.status(500).send(`error code: payment-controllers---3. The request was not sent, because of an error in the request settings, or because of some other server error --> ${err.message}`);
                }
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});

router.post("/create-subscription/:subscriptionId", async (request, response) => {
    try {

        try {
            const result = await axios.post(`http://localhost:3007/api/create-subscription/${request.user.id}/${request.params.subscriptionId}`);
            const data = result.data;
            response.status(result.status).json(data);
        }
        catch (err) {
            if (err.response) {
                if (isProduction) {
                    response.status(err.response.status).send(`error code: payment-4.`);
                }
                else {
                    response.status(err.response.status).send(`error code: payment-controllers---4. A response was received from the server --> ${err.response.data}`);
                }
            }
            else if (err.request) {
                if (isProduction) {
                    response.status(400).send(`error code: payment-5.`);
                }
                else {
                    response.status(400).send(`error code: payment-controllers---5. The request was sent, but no response was received from the server --> ${err.message}`);
                }
            }
            else {
                if (isProduction) {
                    response.status(500).send(`error code: payment-6.`);
                }
                else {
                    response.status(500).send(`error code: payment-controllers---6. The request was not sent, because of an error in the request settings, or because of some other server error --> ${err.message}`);
                }
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});

router.post("/cancel-subscription", verifyLoggedIn, async (request, response) => {
    try {

        try {
            const result = await axios.post(`http://localhost:3007/api/cancel-subscription/${request.user.id}/${request.user.subscriptionId}`);
            const data = result.data;
            response.status(result.status).json(data);
        }
        catch (err) {
            if (err.response) {
                if (isProduction) {
                    response.status(err.response.status).send(`error code: payment-7.`);
                }
                else {
                    response.status(err.response.status).send(`error code: payment-controllers---7. A response was received from the server --> ${err.response.data}`);
                }
            }
            else if (err.request) {
                if (isProduction) {
                    response.status(400).send(`error code: payment-8.`);
                }
                else {
                    response.status(400).send(`error code: payment-controllers---8. The request was sent, but no response was received from the server --> ${err.message}`);
                }
            }
            else {
                if (isProduction) {
                    response.status(500).send(`error code: payment-9.`);
                }
                else {
                    response.status(500).send(`error code: payment-controllers---9. The request was not sent, because of an error in the request settings, or because of some other server error --> ${err.message}`);
                }
            }
        }

    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;