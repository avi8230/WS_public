import "./Register.css";
import { useForm } from "react-hook-form";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";
import notify from "../../../5_Helpers/NotifyMessages";
import errorMessages from "../../../5_Helpers/ErrorMessages";
import CredentialsModel from "../../../1_Models/CredentialsModel";
import { observer } from "mobx-react";
import { useState } from "react";

interface RegisterProps {
    user_localMemory: User_localMemory;
    goToLogin: (display: string) => void;
}

function Register(props: RegisterProps): JSX.Element {

    const { register, handleSubmit, formState } = useForm<CredentialsModel>();
    const [loading, setLoading] = useState<boolean>(false);

    async function submit(credentials: CredentialsModel) {
        try {
            setLoading(true);
            const message = await props.user_localMemory.register(credentials.email);
            notify.success(message);
            setLoading(false);
        }
        catch (error: any) {
            errorMessages(error);
            setLoading(false);
        }
    }

    return (
        <div className="Register">
            {
                props.user_localMemory.user === null ?

                    <form onSubmit={handleSubmit(submit)}>
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
                                <button>Register <i className="fa-solid fa-door-open fa-flip"></i></button>
                                :
                                <button>Register <i className="fa-solid fa-door-open"></i></button>
                        }
                    </form>

                    :

            <div id="step2Div">
                <div>
                    <span>A password has been sent to your email.</span>
                    <span>Kindly log in within five minutes to finalize the registration process.</span>
                </div>
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

export default observer(Register);
