import "./CreateSubscription.css";
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import payment_webAccess from "../../../2_WebAccess/Payment_webAccess";
import notify from "../../../5_Helpers/NotifyMessages";
import user_localMemory from "../../../3_LocalMemory/User_localMemory";
import preferences_localMemory from "../../../3_LocalMemory/Preferences_localMemory";
import words_localMemory from "../../../3_LocalMemory/Words_localMemory";

function CreateSubscription(): JSX.Element {

    const initialOptions = {
        "clientId": "AW3pBUt7PeP7IUCkYPPRVepyQrKd3JaWgTpDMfW3RUX48iPke-ZcPPCNtzGY7hegd0qjIE70zEL-IVKi",
        "enable-funding": "card",
        "disable-funding": "paylater",
        "data-sdk-integration-source": "integrationbuilder_sc",
        vault: "true",
        intent: "subscription",
    };

    const [message, setMessage] = useState("");

    // --------------------------------------------------------------------------------------
    return (
        <div className="CreateSubscription">

            <h2>
                Initiate Your Subscription Here
                <br />
                <i className="fa-solid fa-arrow-down"></i>
            </h2>

            <div>
                <PayPalScriptProvider options={initialOptions}>

                    {/* -------------------------------------------------------------------------------------- */}
                    <PayPalButtons

                        style={{
                            shape: "rect",
                            layout: "vertical",
                        }}

                        // ================= Step 1 - Creating a subscription - when the user clicks the first button. =================
                        createSubscription={async () => {
                            try {
                                // action
                                const data_step1 = await payment_webAccess.createSubscription_step1()

                                // messages
                                if (data_step1?.id) {
                                    setMessage(`Successful subscription...`);
                                    return data_step1.id;
                                }
                                else {
                                    console.error(
                                        { callback: "createSubscription", serverResponse: data_step1 },
                                        JSON.stringify(data_step1, null, 2),
                                    );

                                    const errorDetail = data_step1?.details?.[0];
                                    setMessage(
                                        `Could not initiate PayPal Subscription...<br><br>${errorDetail?.issue || ""
                                        } ${errorDetail?.description || data_step1?.message || ""} ` +
                                        (data_step1?.debug_id ? `(${data_step1.debug_id})` : "")
                                    );
                                }

                            } catch (error) {
                                console.error(error);
                                setMessage(`Could not initiate PayPal Subscription...${error}`);
                            }
                        }}

                        // ================= Step 2 - Opening the site to the user - when the user clicks the second button. =================
                        onApprove={async (data, actions) => {
                            /*
                              No need to activate manually since SUBSCRIBE_NOW is being used.
                              Learn how to handle other user actions from our docs:
                              https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_create
                            */
                            // action
                            const data_step2 = await payment_webAccess.createSubscription_step2(data.subscriptionID);

                            // messages
                            if (data.orderID && data_step2 === 201) {

                                user_localMemory.replaceToken();
                                preferences_localMemory.save();
                                words_localMemory.save();

                                setMessage(user_localMemory.user.subscriptionId);
                                notify.success('Subscription Successfully Activated!');

                            } else {
                                setMessage(`Failed to activate the subscription: ${data.subscriptionID}.`);
                                notify.error('Subscription Not Activated.');
                            }
                        }}

                    />
                    {/* -------------------------------------------------------------------------------------- */}

                </PayPalScriptProvider>
            </div>

            <p>{message}</p>

        </div>
    );
}

export default CreateSubscription;
