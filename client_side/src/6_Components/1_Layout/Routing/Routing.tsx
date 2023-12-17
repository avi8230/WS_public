import "./Routing.css";

import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../../2_Home/Home/Home";
import Words from "../../3_Words/1_Words/Words/Words";
import Payment from "../../4_Payment/Payment/Payment";
import Auth from "../../5_Auth/Auth/Auth";
import Page404 from "../Page404/Page404";

import user_localMemory from "../../../3_LocalMemory/User_localMemory";
import preferences_localMemory from "../../../3_LocalMemory/Preferences_localMemory";
import words_localMemory from "../../../3_LocalMemory/Words_localMemory";


function Routing(): JSX.Element {
    return (
        <div className="Routing">
            <Routes>

                <Route path="/home" element={<Home />} />
                <Route path="/words/:displayMode" element={<Words user_localMemory={user_localMemory} preferences_localMemory={preferences_localMemory} words_localMemory={words_localMemory} />} />
                <Route path="/payment" element={<Payment user_localMemory={user_localMemory} />} />
                <Route path="/auth" element={<Auth user_localMemory={user_localMemory} />} />

                <Route path="/" element={
                    user_localMemory.token
                        ?
                        <Navigate to="/words/list" replace />
                        :
                        <Navigate to="/home" replace />
                } />

                <Route path="*" element={<Page404 />} />

            </Routes>
        </div>
    );
}

export default Routing;
