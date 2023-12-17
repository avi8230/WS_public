import "./Status.css";
import { observer } from "mobx-react";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";

interface StatusProps {
    user_localMemory: User_localMemory;
}

function Status(props: StatusProps): JSX.Element {

    const subscriptionId = props.user_localMemory.user.subscriptionId;
    const role = props.user_localMemory.user.role;
    const deletingWords = props.user_localMemory.user.deletingWords;

    let trialDays = 3 - (60 - deletingWords);
    trialDays = trialDays < 0 ? 0 : trialDays;

    const displayDeletingWords = deletingWords < 0 ? 0 : deletingWords;
    const RemainderSubscription = deletingWords - 60 < 0 ? 0 : deletingWords - 60;

    return (
        <div className="Status">

            <h2>Subscription Status</h2>

            {(() => {
                switch (role) {

                    case 0:
                        return <>
                            <p>
                                <span className="active">
                                    MANAGER
                                </span>
                            </p>
                        </>

                    case 1:
                        return <>
                            <p>
                                <span className="notActive">
                                    NOT ACTIVE
                                    {/* &nbsp;<i className="fa-solid fa-face-frown"></i> */}
                                </span>
                            </p>

                            <p id="trialActive">Trial Period Remaining: <span>{trialDays}</span> days.</p>

                            <p>
                                <i className="fa-solid fa-triangle-exclamation blinker"></i>
                                &nbsp; All your saved words will be deleted after <span>{displayDeletingWords}</span> days. &nbsp;
                                <i className="fa-solid fa-triangle-exclamation blinker"></i>
                            </p>
                        </>

                    case 2:
                        return <>
                            <p>
                                <span className="notActive">
                                    NOT ACTIVE
                                    {/* &nbsp;<i className="fa-solid fa-face-frown"></i> */}
                                </span>
                            </p>

                            <p id="trialNotActive">Trial Period Remaining: <span>{trialDays}</span> days.</p>

                            <p>
                                <i className="fa-solid fa-triangle-exclamation blinker"></i>
                                &nbsp; All your saved words will be deleted after <span>{displayDeletingWords}</span> days. &nbsp;
                                <i className="fa-solid fa-triangle-exclamation blinker"></i>
                            </p>
                        </>

                    case 3:
                        return <>
                            <p>
                                <span className="active">
                                    ACTIVE
                                    {/* &nbsp;<i className="fa-solid fa-face-smile"></i> */}
                                </span>
                            </p>

                            <p>
                                <i className="fa-solid fa-heart blinker"></i>
                                &nbsp; Thank you for subscribing &nbsp;
                                <i className="fa-solid fa-heart blinker"></i>
                            </p>

                            <p>PayPal subscription ID: <span>{subscriptionId}</span></p>
                        </>

                    case 4:
                        return <>
                            <p>
                                <span className="notActive">
                                    NOT ACTIVE
                                    {/* &nbsp;<i className="fa-solid fa-face-frown"></i> */}
                                </span>
                            </p>

                            <p>PayPal subscription ID: <span>{subscriptionId}</span></p>

                            <p><span>{RemainderSubscription}</span> days remaining from the previous subscription.</p>

                            <p>
                                <i className="fa-solid fa-triangle-exclamation blinker"></i>
                                &nbsp; All your saved words will be deleted after <span>{displayDeletingWords}</span> days. &nbsp;
                                <i className="fa-solid fa-triangle-exclamation blinker"></i>
                            </p>
                        </>

                    case 5:
                        return <>
                            <p>
                                <span className="notActive">
                                    NOT ACTIVE
                                    {/* &nbsp;<i className="fa-solid fa-face-frown"></i> */}
                                </span>
                            </p>

                            <p>PayPal subscription ID: <span>{subscriptionId}</span></p>

                            <p>
                                <i className="fa-solid fa-triangle-exclamation blinker"></i>
                                &nbsp; All your saved words will be deleted after <span>{displayDeletingWords}</span> days. &nbsp;
                                <i className="fa-solid fa-triangle-exclamation blinker"></i>
                            </p>
                        </>
                }
            })()}

        </div>
    );
}

export default observer(Status);
