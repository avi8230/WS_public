// https://stackoverflow.com/questions/69087292/requirenode-fetch-gives-err-require-esm
const fetch = require("node-fetch");
require('dotenv').config();
const sharedFunctions = require("./sharedFunctions");
const updateUser = require("./updateUser");

const PAYPAL_PLAN_ID = process.env.PAYPAL_PLAN_ID; // first payment - immediate.
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL;

// ================= Step 1 - Creating a subscription - when the user clicks the first button. =================
/** 
Create Subscription @see https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_create
*/
const createSubscription = async (userAction = "SUBSCRIBE_NOW") => {
    const url = `${PAYPAL_BASE_URL}/v1/billing/subscriptions`;
    const accessToken = await sharedFunctions.generateAccessToken();
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify({
            plan_id: PAYPAL_PLAN_ID,
            application_context: {
                user_action: userAction,
            },
        }),
    });

    return handleResponse(response);
};

// Handle Response
const handleResponse = async (response) => {
    try {
        const jsonResponse = await response.json();
        return {
            jsonResponse,
            httpStatusCode: response.status,
        };
    } catch (err) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
};

// ================= Step 2 - Opening the site to the user - when the user clicks the second button. =================
async function openingWebsite(userId, subscriptionId) {
    return new Promise(async (resolve, reject) => {
        try {
            const subscriptionDetails = await sharedFunctions.showSubscriptionDetails(subscriptionId);
            
            if (subscriptionDetails?.status === "ACTIVE") {
                const result = await updateUser.update_subscriptionId_role_deletingWords(userId, subscriptionId);
                if (result) resolve(true);                
            }
            else resolve(false);
        }
        catch (err) {
            reject(err);
        }
    });
}

// ===================================================
module.exports = {
    createSubscription,
    openingWebsite
}
