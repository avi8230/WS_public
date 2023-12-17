try {
    const express = require("express");
    const cors = require("cors");

    const createSubscriptionController = require("./controllers/createSubscription-controller");
    const cancelSubscriptionController = require("./controllers/cancelSubscription-controller");

    const server = express();
    server.use(cors());
    server.use(express.json()); // parse post params sent in body in json format

    server.use("/api/create-subscription", createSubscriptionController);
    server.use("/api/cancel-subscription", cancelSubscriptionController);

    server.use("*", (request, response) => {
        response.status(404).send("Route Not Found");
    })

    // Type to run: node app / npm start
    server.listen(3007, () => console.log("=========== server7_payment. Listening on http://localhost:3007 ==========="));

    // Update Users =======================================================================================================
    // https://stackoverflow.com/questions/26306090/running-a-function-everyday-midnight
    // https://www.npmjs.com/package/node-schedule
    // https://en.wikipedia.org/wiki/Cron
    // npm install node-schedule
    const schedule = require('node-schedule');
    const updateUser = require("./business-logic/updateUser");

    /*
    '* * * * *' = 
    minute (0–59)
    hour (0–23)
    day of the month (1–31)
    month (1–12)
    day of the week (0–6) (Sunday to Saturday. 7 is also Sunday on some systems)
    */

    // run everyday at midnight:
    schedule.scheduleJob('0 0 * * *', async () => {
        try {
            const result = await updateUser.update_subscriptionId_role_deletingWords();
            console.log(await updateUser.sendEmailToManager("avi8230@gmail.com", '"updateUsers" run', `result: ${result}`));
        }
        catch (err) {
            console.log(err);
            console.log(await updateUser.sendEmailToManager("avi8230@gmail.com", 'error in "updateUsers"', err));
        }
    });

    // run when server starts:
    (async () => {
        try {
            const result = await updateUser.update_subscriptionId_role_deletingWords();
            console.log(result);
            // console.log(await updateUser.sendEmailToManager("avi8230@gmail.com", '"updateUsers" run', `result: ${result}`));
        }
        catch (err) {
            console.log(err);
            console.log(await updateUser.sendEmailToManager("avi8230@gmail.com", 'error in "updateUsers"', err));
        }
    })();
    // ==================================================================================================================    
}
catch (err) {
    console.log(err);
}