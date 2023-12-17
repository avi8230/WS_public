const express = require("express");
const createSubscriptionLogic = require("../business-logic/createSubscription-logic");

const router = express.Router();

// ================= Step 1 - Creating a subscription - when the user clicks the first button. =================
router.post("/", async (req, res) => {
    try {
        try {
            const { jsonResponse, httpStatusCode } = await createSubscriptionLogic.createSubscription();
            res.status(httpStatusCode).json(jsonResponse);
        } catch (error) {
            console.error("Failed to create order:", error);
            res.status(500).json({ error: "Failed to create order." });
        }
    }
    catch (err) {
        console.log(err);
    }
});

// ================= Step 2 - Opening the Website to the user - when the user clicks the second button. =================
router.post("/:userId/:subscriptionId", async (req, res) => {
    try {
        try {
            const userId = req.params.userId;
            const subscriptionId = req.params.subscriptionId;
            const subscriptionActive = await createSubscriptionLogic.openingWebsite(userId, subscriptionId);

            if (subscriptionActive) res.status(201).send("Subscription Successfully Activated!");
            else res.status(400).send("Subscription Not Activated.");
        }
        catch (err) {
            if (err.response) {
                res.status(err.response.status).send(`1: ${err.response.data}`);
            }
            else if (err.request) {
                res.status(400).send(`2: ${err.message}`);
            }
            else {
                res.status(500).send(`3: ${err.message}`);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

// ===================================================
module.exports = router;
