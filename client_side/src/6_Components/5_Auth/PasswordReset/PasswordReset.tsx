import "./PasswordReset.css";
import { useForm } from "react-hook-form";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";
import notify from "../../../5_Helpers/NotifyMessages";
import errorMessages from "../../../5_Helpers/ErrorMessages";
import CredentialsModel from "../../../1_Models/CredentialsModel";
import { observer } from "mobx-react";
import { useState } from "react";

interface PasswordResetProps {
    user_localMemory: User_localMemory;
    goToLogin: (display: string) => void;
}

function PasswordReset(props: PasswordResetProps): JSX.Element {

    const { register, handleSubmit, formState } = useForm<CredentialsModel>();
    const [loading, setLoading] = useState<boolean>(false);

    // Step 1
    async function submit_1(credentials: CredentialsModel) {
        try {
            setLoading(true);
            const message = await props.user_localMemory.passwordReset_stepOne(credentials.email);
            notify.success(message);
            setLoading(false);
        }
        catch (error: any) {
            errorMessages(error);
            setLoading(false);
        }
    }

    // Step 2
    async function submit_2(credentials: CredentialsModel) {
        try {
            setLoading(true);
            const message = await props.user_localMemory.passwordReset_stepTwo(credentials.email, credentials.password);
            notify.success(message);
            setLoading(false);
        }
        catch (error: any) {
            errorMessages(error);
            setLoading(false);
        }
    }

    return (
        <div className="PasswordReset">
            {
                // Step 1
                props.user_localMemory.user === null ?

                    <form onSubmit={handleSubmit(submit_1)}>
                        <div className="inputBoxesDiv">
                            <label>Email</label>
                            <div className="errorMessage">{formState.errors.email?.message}</div>
                            <input type="text" autoFocus {...register("email", {
                                required: { value: true, message: "Missing email. " },
                                maxLength: { value: 100, message: "Up to 100 characters. " },
                                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address. " }
                            })} />
                        </div>
                        {
                            loading ?
                                <button>Password Reset <i className="fa-solid fa-unlock-keyhole fa-flip"></i></button>
                                :
                                <button>Password Reset <i className="fa-solid fa-unlock-keyhole"></i></button>
                        }
                    </form>

                    :

                    props.user_localMemory.user.role === -2 ?

                        // Step 2
                        <form onSubmit={handleSubmit(submit_2)}>
                            <div className="inputBoxesDiv">
                                <input type="hidden" value={props.user_localMemory.user?.email} {...register("email")} />

                                <span>The temporary password has been sent to your email.</span>
                                <span>Passwords expire after five minutes.</span>
                                <label>Temporary Password</label>
                                <div className="errorMessage">{formState.errors.password?.message}</div>
                                <input type="text" autoFocus {...register("password", {
                                    required: { value: true, message: "Missing password" },
                                    minLength: { value: 4, message: "Password must be minimum 4 chars. " },
                                    maxLength: { value: 30, message: "Password can't exceed 30 chars. " }
                                })} />
                            </div>
                            {
                                loading ?
                                    <button>Password Reset <i className="fa-solid fa-unlock-keyhole fa-flip"></i></button>
                                    :
                                    <button>Password Reset <i className="fa-solid fa-unlock-keyhole"></i></button>
                            }
                        </form>

                        :

                        // Step 3
                        <div id="step3Div">
                            <span>Your new password has been emailed to you.</span>
                            <button
                                onClick={() => { props.goToLogin("login") }}>
                                Login
                                <i className="fa-solid fa-right-to-bracket"></i>
                            </button>
                        </div>
            }

        </div>
    );
}

export default observer(PasswordReset);
