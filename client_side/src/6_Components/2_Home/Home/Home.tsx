import "./Home.css";
import { useMediaQuery } from "react-responsive";
import useWindowDimensions from "../../../5_Helpers/UseWindowDimensions";
import { useNavigate } from "react-router-dom";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import notify from "../../../5_Helpers/NotifyMessages";

function Home(): JSX.Element {

    // Height and Width -------------------------------
    const { height: heightOfWindow, width: widthOfWindow } = useWindowDimensions();
    let isMobile = useMediaQuery({ maxWidth: 840 });
    const [widthOfDiv, setWidthOfDiv] = useState<number>();

    useEffect(() => {
        let width = isMobile ? widthOfWindow - 36 : 805;
        setWidthOfDiv(width);
    }, [widthOfWindow]);

    // Rerouting by clicking div -------------------------------
    let navigate = useNavigate();
    function navigateHandler(args: SyntheticEvent): void {
        if (!(args.target as HTMLDivElement).matches("a")) {
            const routingTo = (args.currentTarget as HTMLDivElement).id;
            navigate("/words/" + routingTo);
        }
    }

    // Copying the email -------------------------------
    const emailRef = useRef(null);

    const handle_Email_CopyClick = () => {
        try {
            // Select the text inside the input element
            emailRef.current.select();
            // Copy the selected text
            document.execCommand('copy');
            // Deselect the text
            window.getSelection().removeAllRanges();

            notify.success('Email copied to clipboard!');
        } catch (err) {
            notify.error('Error copying text.');
        }
    };

    // Copying the website address -------------------------------
    const websiteAddressRef = useRef(null);

    const handle_WebsiteAddress_CopyClick = () => {
        try {
            websiteAddressRef.current.select();
            document.execCommand('copy');
            window.getSelection().removeAllRanges();

            notify.success('Website Address copied to clipboard! I hope you enjoy the site and will share it with your friends :-)');
        } catch (err) {
            notify.error('Error copying text.');
        }
    };

    // -------------------------------
    return (
        <div className="Home"
            style={{
                height: heightOfWindow - 33,
                width: widthOfWindow
            }}>

            {/* 1-Home -------------------------------------------------------- */}
            <div id="homeDiv">

                <h1><span id="logo">W</span>ordStorage</h1>

                <h2>Greetings and welcome to "Word Storage"!</h2>

                <p>With this app, you can memorize words you want to remember, learn them, and test your knowledge of them.</p>
                <p>Make each word come alive with a sentence and an image.</p>
                <p>We support <span id="numOfLanguages">149</span> languages so you can listen to your words and sentences!!</p>

                <span id="websiteAddressSpan" onClick={handle_WebsiteAddress_CopyClick}>wordstorage.com</span>

                <input
                    ref={websiteAddressRef}
                    type="text"
                    value={"https://wordstorage.com"}
                    readOnly
                    style={{ position: 'absolute', left: '-9999px' }} // Hide the input element
                />

            </div>

            {/* 2-Words -------------------------------------------------------- */}
            <div id="wordsDiv">

                <h1><i className="fa-solid fa-lines-leaning fa-bounce"></i> My Words</h1>

                <h2>There are three components to your personal word library:</h2>

                <div id="list" style={{ width: widthOfDiv }} onClick={navigateHandler}>
                    <h3><i className="fa-solid fa-list fa-fade"></i> List</h3>
                    <p>Easily manage your words by adding, updating, and deleting them.</p>
                    <span id="tipSpan"><b>Tip: </b>To listen to the words and sentences, click on them.</span><br />
                </div>

                <div id="media-player" style={{ width: widthOfDiv }} onClick={navigateHandler}>
                    <h3><i className="fa-solid fa-music fa-fade"></i> Media Player</h3>
                    <p>Use a media player to memorize your words.</p>
                    <span id="tipSpan"><b>Tip: </b>Press the <span className="key">arrow</span> keys and <span className="key">"Space"</span> key.</span><br />
                    <span id="tipSpan"><b>Tip: </b><span className="key">Swipe</span> right and left, and <span className="key">tap</span> the screen.</span><br />
                    <span id="tipSpan">
                        <b>Tip: </b>Make sure background activity is enabled on your mobile phone.&nbsp;
                        <a href="https://www.guidingtech.com/fixes-music-stops-playing-samsung-when-phone-locks/"
                            target="_blank"
                            id="guideA">
                            Check out the guide.
                        </a>
                    </span>
                </div>

                <div id="test" style={{ width: widthOfDiv }} onClick={navigateHandler}>
                    <h3><i className="fa-solid fa-microscope fa-fade"></i> Test</h3>
                    <p>For each word, give yourself a score from 1 to 10.</p>
                    <span id="tipSpan"><b>Tip: </b>Press the <span className="key">arrow</span> keys and <span className="key">"Space"</span> or <span className="key">"0"</span> keys.</span><br />
                    <span id="tipSpan"><b>Tip: </b><span className="key">Swipe</span> up, down, right and left, and <span className="key">tap</span> the screen.</span>
                </div>

            </div>

            {/* 3-Application -------------------------------------------------------- */}
            {/* <div id="applicationDiv">
                <NavLink to="https://median.co/share/xnarjy#androidphone" target="_blank">

                    <h1><i className="fa-solid fa-mobile-screen-button"></i> Application</h1>

                    <h2>The app is available for download on mobile devices.</h2>

                    <p>Available for Android and iOS</p>

                </NavLink>
            </div> */}

            {/* 3-Application -------------------------------------------------------- */}
            <div id="applicationDiv">

                <h1><i className="fa-solid fa-mobile-screen-button fa-bounce"></i> Application</h1>

                <h2>Download the application on your Windows, Android, or iOS device.</h2>

                <p>
                    1. In your Chrome browser on either your computer or mobile device, select the <i className="fa-solid fa-ellipsis-vertical"></i> icon in the top-left corner.
                    <br />
                    2. Choose <span id="installSpan">"Install WordStorage"</span> from the menu.
                </p>

            </div>

            {/* 4-Payment -------------------------------------------------------- */}
            <div id="paymentDiv">
                <NavLink to="/payment">

                    <h1><i className="fa-solid fa-credit-card fa-bounce"></i> Payment</h1>

                    <h2>We offer a free trial and low prices!</h2>

                    <p>Get three days for free.</p>
                    <p>After that, you will be charged $1 per month.</p>

                </NavLink>
            </div>

            {/* 5-ContactUs -------------------------------------------------------- */}
            <div id="contactUsDiv" onClick={handle_Email_CopyClick}>

                <h1><i className="fa-solid fa-envelope fa-bounce"></i> Contact Us</h1>

                <h2>We would be happy to hear from you <i className="fa-solid fa-face-smile"></i></h2>

                <p id="email">Email: wordstorage.com@gmail.com</p>

                <input
                    ref={emailRef}
                    type="text"
                    value={"wordstorage.com@gmail.com"}
                    readOnly
                    style={{ position: 'absolute', left: '-9999px' }} // Hide the input element
                />

            </div>

            {/* 6-Rights -------------------------------------------------------- */}
            <div id="rightsDiv">

                <i className="fa-regular fa-copyright"></i>
                All rights reserved.

            </div>

        </div>
    );
}

export default Home;
