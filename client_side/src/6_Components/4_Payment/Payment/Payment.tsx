import "./Payment.css";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";
import { Navigate } from "react-router-dom";
import CreateSubscription from "../CreateSubscription/CreateSubscription";
import { observer } from "mobx-react";
import CancelSubscription from "../CancelSubscription/CancelSubscription";
import Status from "../Status/Status";
import PlanDetails from "../PlanDetails/PlanDetails";
import SitePolicy from "../SitePolicy/SitePolicy";
import useWindowDimensions from "../../../5_Helpers/UseWindowDimensions";

interface PaymentProps {
    user_localMemory: User_localMemory;
}

function Payment(props: PaymentProps): JSX.Element {
    const role = props.user_localMemory.user?.role;

    // Height -----------------
    const { height: heightOfWindow, width: widthOfWindow } = useWindowDimensions();

    // -----------------
    if (!props.user_localMemory.token) { return <Navigate to="/auth" />; }

    // -----------------
    return (
        <div className="Payment" style={{
            height: heightOfWindow - 33,
            width: widthOfWindow
        }}>

            <h1><i className="fa-solid fa-credit-card"></i> Payment</h1>

            <Status user_localMemory={props.user_localMemory} />

            <PlanDetails user_localMemory={props.user_localMemory} />

            {/* <SitePolicy user_localMemory={props.user_localMemory} /> */}

            {
                role != 0 && (
                    role === 3 ?
                        <CancelSubscription user_localMemory={props.user_localMemory} />
                        :
                        <CreateSubscription />
                )
            }

        </div>
    );
}

export default observer(Payment);
