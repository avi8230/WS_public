const express = require("express");
const cancelSubscriptionLogic = require("../business-logic/cancelSubscription-logic");

const router = express.Router();

// ================= Cancel Subscription =================
router.post("/:userId/:subscriptionId", async (req, res) => {
    try {
        try {
            const userId = req.params.userId;
            const subscriptionId = req.params.subscriptionId;
            const isSubscriptionCanceled = await cancelSubscriptionLogic.cancelSubscription(userId, subscriptionId);

            if (isSubscriptionCanceled) res.sendStatus(204);
            else res.status(404).send("Error - The subscription does not exist.");
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

module.exports = router;