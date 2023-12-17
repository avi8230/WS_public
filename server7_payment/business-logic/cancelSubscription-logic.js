const fetch = require('node-fetch');
const sharedFunctions = require("./sharedFunctions");
const updateUser = require("./updateUser");

const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL;

/** ================= Cancel Subscription =================
@see https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_cancel
*/
async function cancelSubscription(userId, subscriptionId) {
    return new Promise(async (resolve, reject) => {
        try {
            // Closing a PayPal subscription
            const accessToken = await sharedFunctions.generateAccessToken();
            const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ "reason": "The customer canceled the subscription through the website." })
            });

            // Closing a subscription with me
            if (response.status === 204) {
                const result = await updateUser.update_subscriptionId_role_deletingWords(userId);
                if (result) resolve(true);
            }
            resolve(false);
        }
        catch (err) {
            reject(err);
        }
    });
}

// ===================================================
module.exports = {
    cancelSubscription
}
