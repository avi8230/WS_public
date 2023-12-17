import Navbar from "../Navbar/Navbar";
import "./Layout.css";
import user_LocalMemory from "../../../3_LocalMemory/User_localMemory";
import { BrowserRouter } from "react-router-dom";
import Routing from "../Routing/Routing";

function Layout(): JSX.Element {
    return (
        <BrowserRouter>
            <div className="Layout">

                <Navbar user_localMemory={user_LocalMemory} />
                <main><Routing /></main>

            </div>
        </BrowserRouter>
    );
}

export default Layout;
