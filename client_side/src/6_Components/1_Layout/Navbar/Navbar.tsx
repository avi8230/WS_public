import { observer } from "mobx-react";
import "./Navbar.css";
import { NavLink, useLocation } from "react-router-dom";
import { User_localMemory } from "../../../3_LocalMemory/User_localMemory";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface NavbarProps {
    user_localMemory: User_localMemory;
}

function Navbar(props: NavbarProps): JSX.Element {

    const name = props.user_localMemory.user?.name;
    const isMobile = useMediaQuery({ maxWidth: 577 });
    const isLogin = props.user_localMemory.token;

    // Listening for route changes -----------------------------------------------
    const [isActive, setIsActive] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/words/media-player" ||
            location.pathname === "/words/test") {
            setIsActive(true);
        }
        else setIsActive(false);
    }, [location]);

    // Delete User -----------------------------------------------
    function deleteUser() {
        if (!props.user_localMemory.token) {
            props.user_localMemory.delete();
        }
    }

    // -----------------------------------------------
    return (
        <div className="Navbar">
            <NavLink to="/home">
                {(!isMobile || !isLogin) && 'Home '}
                <i className="fa-solid fa-house"></i>
            </NavLink>
            {
                // [0, 1, 3, 4].includes(props.user_localMemory.user?.role) &&
                isLogin &&
                <NavLink to="/words/list" className={isActive ? 'myActive' : ''}>
                    {!isMobile && 'My Words '}
                    <i className={"fa-solid fa-lines-leaning"}></i>
                </NavLink>
            }
            {
                isLogin &&
                <NavLink to="/payment">
                    {!isMobile && 'Payment '}
                    <i className="fa-solid fa-credit-card"></i>
                </NavLink>
            }
            <NavLink to="/auth" onClick={deleteUser}>
                {isMobile && isLogin ? '' : name ? name.slice(0, 12) + ' ' : 'guest '}
                <i className="fa-solid fa-user"></i>
            </NavLink>
        </div>
    );
}

export default observer(Navbar);
