import "./PlanDetails.css";
import { observer } from "mobx-react";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";

interface PlanDetailsProps {
    user_localMemory: User_localMemory;
}

function PlanDetails(props: PlanDetailsProps): JSX.Element {
    return (
        <div className="PlanDetails">
            <h2>Plan Details</h2>
            <p>Monthly fee: $1</p>
            <p>You have the flexibility to cancel your subscription at any time.</p>
            <p>In the event of an inactive subscription, all stored words will be deleted after 60 days.</p>
        </div>
    );
}

export default observer(PlanDetails);
