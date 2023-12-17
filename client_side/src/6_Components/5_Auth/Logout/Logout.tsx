import "./Logout.css";
import { observer } from "mobx-react";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";
import notify from "../../../5_Helpers/NotifyMessages";
import UserModel from "../../../1_Models/UserModel";
import errorMessages from "../../../5_Helpers/ErrorMessages";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Overlay from "../../SharedArea/Overlay/Overlay";
import { useNavigate } from "react-router-dom";
import imageAndAudio_localMemory from "../../../3_LocalMemory/imageAndAudio_localMemory";

interface LogoutProps {
    user_localMemory: User_localMemory;
}

function Logout(props: LogoutProps): JSX.Element {
    // Form --------------------------------
    const { register, handleSubmit, formState } = useForm<UserModel>({
        defaultValues: {
            name: props.user_localMemory.user.name
        }
    });

    const [loading, setLoading] = useState<boolean>(false);

    async function submit(user: UserModel) {
        try {
            if (user.name != props.user_localMemory.user.name || user.password) {
                setLoading(true);
                const message = await props.user_localMemory.updateNameAndPassword(user.name, user.password);
                notify.success(message);
                setLoading(false);
            }
        }
        catch (error: any) {
            errorMessages(error);
            setLoading(false);
        }
    }
    
    // Overlay --------------------------------
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    }
    
    // Logout --------------------------------
    function logout(): void {
        imageAndAudio_localMemory.deleteAll();
        imageAndAudio_localMemory.update_allImagesLoaded(false);
        const message = props.user_localMemory.logout();
        notify.success(message);
    }

    // Redirect to words page --------------------------------
    const nav = useNavigate();
    useEffect(() => {
        if (props.user_localMemory.reentered) {
            setTimeout(() => nav('/words/list'), 1000);
            props.user_localMemory.updateNowEntered();
        }
    }, []);

    // ----------------------------------------------------------------
    return (
        <div className="Logout">

            <div id="logoutDiv">
                <div id="nameDiv">
                    <h1>{props.user_localMemory.user?.name}</h1>
                    <i className="fa-regular fa-pen-to-square" onClick={toggleOverlay}></i>
                </div>

                <button onClick={logout}>Logout <i className="fa-solid fa-right-from-bracket"></i></button>
            </div>

            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                <form onSubmit={handleSubmit(submit)}>
                    <div>
                        <label>Name</label>
                        <div className="errorMessage">{formState.errors.name?.message}</div>
                        <input type="text" {...register("name", {
                            required: { value: true, message: "Missing Name" },
                            minLength: { value: 2, message: "Name must be minimum 2 chars" },
                            maxLength: { value: 30, message: "Name can't exceed 30 chars" }
                        })} />
                    </div>

                    <div>
                        <label>Password</label>
                        <div className="errorMessage">{formState.errors.password?.message}</div>
                        <input type="text" {...register("password", {
                            minLength: { value: 4, message: "Password must be minimum 4 chars. " },
                            maxLength: { value: 30, message: "Password can't exceed 30 chars. " }
                        })} />
                    </div>

                    {
                        loading ?
                            <button className="save">Save<i className="fa-solid fa-floppy-disk fa-flip"></i></button>
                            :
                            <button className="save">Save<i className="fa-solid fa-floppy-disk"></i></button>
                    }
                </form>
            </Overlay>


        </div>
    );
}

export default observer(Logout);
