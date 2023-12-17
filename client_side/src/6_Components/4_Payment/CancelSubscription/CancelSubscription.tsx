import "./CancelSubscription.css";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";
import payment_webAccess from "../../../2_WebAccess/Payment_webAccess";
import notify from "../../../5_Helpers/NotifyMessages";
import { observer } from "mobx-react";
import words_localMemory from "../../../3_LocalMemory/Words_localMemory";
import preferences_localMemory from "../../../3_LocalMemory/Preferences_localMemory";
import { useState } from "react";
import errorMessages from "../../../5_Helpers/ErrorMessages";
import Overlay from "../../SharedArea/Overlay/Overlay";

interface CancelSubscriptionProps {
    user_localMemory: User_localMemory;
}

function CancelSubscription(props: CancelSubscriptionProps): JSX.Element {
    const deletingWords = props.user_localMemory.user.deletingWords;

    // Overlay --------------------------------
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    // Cancel Subscription--------------------------------
    const [loading, setLoading] = useState<boolean>(false);

    async function cancelSubscription(): Promise<void> {
        try {
            setLoading(true);

            const status = await payment_webAccess.cancelSubscription();

            if (status === 204) {
                props.user_localMemory.replaceToken();
                if (props.user_localMemory.user.role === 5) {
                    words_localMemory.clearMemory();
                    preferences_localMemory.clearMemory();
                }
                notify.success('Subscription Canceled Successfully!');
            }
            else console.log(status);

            setLoading(false);
            toggleOverlay();
        }
        catch (error: any) {
            errorMessages(error);
            setLoading(false);
        }
    }

    // --------------------------------
    return (
        <div className="CancelSubscription">

            <h2>
                You can unsubscribe here
                <br />
                <i className="fa-solid fa-arrow-down"></i>
            </h2>

            <button onClick={toggleOverlay}>
                Cancel Subscription
                <i className="fa-solid fa-ban"></i>
            </button>

            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                <div id="container">

                    <div id="textDiv">
                        By choosing to unsubscribe, all your saved words will be deleted after {deletingWords} days.
                        <br />
                        Are you certain you wish to proceed with unsubscribing ?
                    </div>

                    <div id="buttonsDiv">
                        <button onClick={cancelSubscription}>
                            Cancel Subscription
                            {
                                loading ?
                                    <i className="fa-solid fa-ban fa-flip"></i>
                                    :
                                    <i className="fa-solid fa-ban"></i>
                            }
                        </button>
                    </div>

                </div>
            </Overlay>

        </div>
    );
}

export default observer(CancelSubscription);
