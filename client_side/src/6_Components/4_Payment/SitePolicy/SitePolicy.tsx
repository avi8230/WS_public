import "./SitePolicy.css";
import { observer } from "mobx-react";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";

interface SitePolicyProps {
    user_localMemory: User_localMemory;
}

function SitePolicy(props: SitePolicyProps): JSX.Element {
    return (
        <div className="SitePolicy">
            <h2>Site Policy</h2>

        </div>
    );
}

export default observer(SitePolicy);
