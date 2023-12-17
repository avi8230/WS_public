const axios = require("axios");
const sharedFunctions = require("./sharedFunctions");

// 1 - Get All Users -----------------------------------------------------------------
async function getAllUsers() {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await axios.get(`http://localhost:3002/api/users`);
            resolve(users.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

// 2 - Get User -----------------------------------------------------------------
async function getUser(userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await axios.get(`http://localhost:3002/api/users/${userId}`);
            resolve(user.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

// 3 - How Many Days Passed -----------------------------------------------------------------
// https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
function howManyDaysPassed(date) {
    data = new Date(date);
    const today = new Date();

    const day = 1000 * 60 * 60 * 24;
    const diffMilliseconds = Math.abs(today - data);
    const diffDays = Math.ceil(diffMilliseconds / day);

    return diffDays;
}

// 4 - Number Limit
function numberLimit(num) { return num < -100 ? -100 : num; }

// 5 - Update User -----------------------------------------------------------------
async function updateUserInDB(userId, subscriptionId, role, deletingWords) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = {};
            if (subscriptionId) user.subscriptionId = subscriptionId;
            if (role) user.role = role;
            if (typeof deletingWords === 'number') user.deletingWords = deletingWords;
            const updateUser = await axios.patch(`http://localhost:3002/api/users/${userId}`, user);
            resolve(updateUser.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

// 6 - Send Email Before Deleting Words -----------------------------------------------------------------
async function sendEmailBeforeDeleting(email, days) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axios.post(`http://localhost:3006/api/send-email-before-deleting/${email}/${days}`);
            if (result.status === 200)
                resolve(true);
            resolve(false);
        }
        catch (err) {
            reject(err);
        }
    });
}

// 7 - Send Email To Manager -----------------------------------------------------------------
async function sendEmailToManager(email, subject, message) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axios.post(`http://localhost:3006/api/send-email-to-manager/${email}/${subject}/${message}`);
            if (result.status === 200)
                resolve(true);
            resolve(false);
        }
        catch (err) {
            reject(err);
        }
    });
}

// 8 - Delete Words -----------------------------------------------------------------
async function deleteWords(userId, userUuid) {
    return new Promise(async (resolve, reject) => {
        try {
            const result_deleteWords = await axios.delete(`http://localhost:3002/api/words/delete-all-words/${userId}`);
            const result_deleteImages = await axios.delete(`http://localhost:3003/api/delete/folder/${userUuid}`);
            const result_deleteAudio = await axios.delete(`http://localhost:3004/api/delete/folder/${userUuid}`);
            if (result_deleteWords.status === 204 && result_deleteImages.status === 204 && result_deleteAudio.status === 204)
                resolve(true);
            resolve(false);
        }
        catch (err) {
            reject(err);
        }
    });
}

// 9 - Update Users ----------------------------------------------------------------------------------------------------------------------------------
async function update_subscriptionId_role_deletingWords(userId, subscriptionId) {
    return new Promise(async (resolve, reject) => {
        try {
            if (userId) {
                const user = await getUser(userId);
                if (subscriptionId) user.subscriptionId = subscriptionId;
                await updateUser(user);
                resolve(true);
            }
            else {
                const users = await getAllUsers();
                users.forEach(async (user) => { updateUser(user) });
                resolve(true);
            }
        }
        catch (err) {
            reject(err);
        }
    });
}

// 10 - Update User ----------------------------------------------------------------------------
// Roles:
// open ----> 0: Manager.
// open ----> 1: Subscription: NO. Trial: ACTIVE.
// blocked -> 2: Subscription: NO. Trial: END.
// open ----> 3: Subscription: ACTIVE.
// open ----> 4: Subscription: CANCELLED. Days left from the previous subscription: YES.
// blocked -> 5: Subscription: CANCELLED. Days left from the previous subscription: NO.
async function updateUser(user) {
    // ------- Update User -------
    // Manager ------------------------------------------------------------------------------------
    if (user.role === 0) {
        await updateUserInDB(user.id, user.subscriptionId, 0, 60);
        return;
    }
    // Subscription: NO ---------------------------------------------------------------------------
    if (!user.subscriptionId) {
        const daysPassed = howManyDaysPassed(user.date);
        daysPassed > 4 ? // Trial: END / ACTIVE ?
            await updateUserInDB(user.id, user.subscriptionId, 2, numberLimit(60 - daysPassed)) :
            await updateUserInDB(user.id, user.subscriptionId, 1, numberLimit(60 - daysPassed));
    }
    // Subscription: ACTIVE / CANCELLED -----------------------------------------------------------
    else {
        const subscriptionDetails = await sharedFunctions.showSubscriptionDetails(user.subscriptionId);
        const status = subscriptionDetails?.status;
        // *******This code needs testing****************************************************************************************
        const lastPayment = subscriptionDetails?.billing_info?.last_payment?.time;
        if (lastPayment) { // if there was a payment
            const daysPassed = howManyDaysPassed(lastPayment);
            const daysLeft = 31 - daysPassed;
            const deletingWords = 60 + daysLeft;
            status === "ACTIVE" ? // Subscription: ACTIVE
                await updateUserInDB(user.id, user.subscriptionId, 3, numberLimit(deletingWords))
                :
                daysLeft < 0 ? // Days left from the previous subscription: NO / YES ?
                    await updateUserInDB(user.id, user.subscriptionId, 5, numberLimit(deletingWords))
                    :
                    await updateUserInDB(user.id, user.subscriptionId, 4, numberLimit(deletingWords));
        }
        // *********************************************************************************************************************
        else { // if there was no payment
            const start_time = subscriptionDetails.start_time;
            const daysPassed = howManyDaysPassed(start_time);
            const deletingWords = 60 - daysPassed;
            status === "ACTIVE" ? // Subscription: ACTIVE
                await updateUserInDB(user.id, user.subscriptionId, 3, numberLimit(deletingWords))
                :
                await updateUserInDB(user.id, user.subscriptionId, 5, numberLimit(deletingWords));
        }
    }

    // Sending an email before deleting the words + deleting the words -------------------------------
    const newUser = await getUser(user.id);
    const email = newUser.email;
    const daysToDelete = newUser.deletingWords;

    // Sending email
    if (daysToDelete === 20) {
        // Sending an alert to the client
        try {
            const result = await sendEmailBeforeDeleting(email, daysToDelete);
            console.log(`Message sent to customer "${email}": ${result}`);
        }
        catch (err) { console.log(err); }

        // Sending an alert to the manager
        try {
            const result = await sendEmailToManager(
                "avi8230@gmail.com",
                `Warning To The Customer`,
                `Client: ${email}. Days to delete his words: ${daysToDelete}.`);
            console.log(`Message sent to manager: ${result}`);
        }
        catch (err) { console.log(err); }
    }

    // deleting the words
    if (daysToDelete < 0 && daysToDelete > -5) {
        try {
            const result = await deleteWords(user.id, user.uuid);
            console.log(`words deleted: ${result}`);
        }
        catch (err) { console.log(err); }

        // Sending an alert to the manager
        try {
            const result = await sendEmailToManager(
                "avi8230@gmail.com",
                `Deleted words to the customer!`,
                `Deleted words to the customer ${email}.`);
            console.log(`Message sent to manager: ${result}`);
        }
        catch (err) { console.log(err); }
    }
}
// --------------------------------------------------------------------------------------------------

module.exports = {
    sendEmailToManager,
    update_subscriptionId_role_deletingWords
}
