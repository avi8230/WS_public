import "./Login.css";
import { useForm } from "react-hook-form";
import CredentialsModel from "../../../1_Models/CredentialsModel";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";
import notify from "../../../5_Helpers/NotifyMessages";
import errorMessages from "../../../5_Helpers/ErrorMessages";
import { observer } from "mobx-react";
import { useState } from "react";

interface LoginProps {
    user_localMemory: User_localMemory;
}

function Login(props: LoginProps): JSX.Element {

    // form ------------------
    const { register, handleSubmit, formState } = useForm<CredentialsModel>();
    const [loading, setLoading] = useState<boolean>(false);

    async function submit(credentials: CredentialsModel) {
        try {
            setLoading(true);
            const message = await props.user_localMemory.login(credentials);
            notify.success(message);
            setLoading(false);
        }
        catch (error: any) {
            errorMessages(error);
            setLoading(false);
        }
    }

    // autoFocus ------------------
    const isAutoFocus = props.user_localMemory.user == null;

    return (
        <div className="Login">

            <form onSubmit={handleSubmit(submit)}>
                <div className="inputBoxesDiv">
                    <div>
                        <label>Email</label>
                        <div className="errorMessage">{formState.errors.email?.message}</div>
                        <input type="text" autoFocus={isAutoFocus} defaultValue={props.user_localMemory.user?.email} {...register("email", {
                            required: { value: true, message: "Missing email. " },
                            maxLength: { value: 100, message: "Up to 100 characters. " },
                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address. " }
                        })} />
                        <br />
                    </div>

                    <div>
                        <label>{props.user_localMemory.user ? "Please check your email for the password" : "Password"} </label>
                        <div className="errorMessage">{formState.errors.password?.message}</div>
                        <input type="text" autoFocus={!isAutoFocus} {...register("password", {
                            required: { value: true, message: "Missing password" },
                            minLength: { value: 4, message: "Password must be minimum 4 chars. " },
                            maxLength: { value: 30, message: "Password can't exceed 30 chars. " }
                        })} />
                    </div>
                </div>

                {
                    loading ?
                        <button>Login<i className="fa-solid fa-right-to-bracket fa-flip"></i></button>
                        :
                        <button>Login<i className="fa-solid fa-right-to-bracket"></i></button>
                }

            </form>

        </div>
    );
}

export default observer(Login);
