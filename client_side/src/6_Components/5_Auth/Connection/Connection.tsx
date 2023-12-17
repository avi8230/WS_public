import "./Connection.css";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";
import { observer } from "mobx-react";
import { useState } from "react";
import Login from "../Login/Login";
import Register from "../Register/Register";
import PasswordReset from "../PasswordReset/PasswordReset";

interface LoginProps {
    user_localMemory: User_localMemory;
}

function Connection(props: LoginProps): JSX.Element {

    // Display Mode ----------------------------------------
    const [display, setDisplay] = useState<string>('login');

    // Delete User ----------------------------------------
    function deleteUser() {
        props.user_localMemory.delete();
    }

    // Change Button Color ----------------------------------------
    const [isClickedLogin, setIsClickedLogin] = useState(true);
    const [isClickedRegister, setIsClickedRegister] = useState(false);
    const [isClickedPasswordReset, setIsClickedPasswordReset] = useState(false);

    const buttonLoginClasses = isClickedLogin ? 'clicked-button' : 'unClicked-button';
    const buttonRegisterClasses = isClickedRegister ? 'clicked-button' : 'unClicked-button';
    const buttonPasswordResetClasses = isClickedPasswordReset ? 'clicked-button' : 'unClicked-button';

    const handleClick = (display: string) => {
        switch (display) {
            case 'login': {
                setIsClickedLogin(true);
                setIsClickedRegister(false);
                setIsClickedPasswordReset(false);
            }
                break;
            case 'register': {
                setIsClickedLogin(false);
                setIsClickedRegister(true);
                setIsClickedPasswordReset(false);
                deleteUser();
            }
                break;
            case 'passwordReset': {
                setIsClickedLogin(false);
                setIsClickedRegister(false);
                setIsClickedPasswordReset(true);
                deleteUser();
            }
        }
        setDisplay(display);
    };

    // --------------------------------------------------------------------------------------------------------------
    return (
        <div className="Connection">

            {/* Buttons ---------------------------------------- */}
            <div id="buttonsDiv">
                <span className={`loginSpan ${buttonLoginClasses}`} onClick={() => handleClick('login')}>Login</span>
                <span className={`registerSpan ${buttonRegisterClasses}`} onClick={() => handleClick('register')}>Register</span>
                <span className={`passwordResetSpan ${buttonPasswordResetClasses}`} onClick={() => handleClick('passwordReset')}>Password Reset</span>
            </div>

            {/* Content ---------------------------------------- */}
            <div id="contentDiv">
                {(() => {
                    switch (display) {
                        case 'login': return <Login user_localMemory={props.user_localMemory} />
                        case 'register': return <Register user_localMemory={props.user_localMemory} goToLogin={handleClick} />
                        case 'passwordReset': return <PasswordReset user_localMemory={props.user_localMemory} goToLogin={handleClick} />
                        default: return null
                    }
                })()}
            </div>

        </div>
    );
}

export default observer(Connection);
