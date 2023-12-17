import "./Auth.css";
import Logout from "../Logout/Logout";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";
import { observer } from "mobx-react";
import Connection from "../Connection/Connection";

interface AuthProps {
    user_localMemory: User_localMemory;
}

function Auth(props: AuthProps): JSX.Element {
    return (
        <div className="Auth">
            {
                props.user_localMemory.token === null ?
                    <Connection user_localMemory={props.user_localMemory} /> :
                    <Logout user_localMemory={props.user_localMemory} />
            }
        </div>
    );
}

export default observer(Auth);
