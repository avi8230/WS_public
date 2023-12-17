import { observer } from "mobx-react";
import "./Words.css";
import { Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { User_localMemory } from "../../../../3_LocalMemory/User_localMemory";
import { Preferences_localMemory } from "../../../../3_LocalMemory/Preferences_localMemory";
import { Words_localMemory } from "../../../../3_LocalMemory/Words_localMemory";
import SortAndSelect from "../../2_SortAndSelect/SortAndSelect/SortAndSelect";
import List from "../../3_List/List/List";
import MediaPlayer from "../../4_MediaPlayer/MediaPlayer/MediaPlayer";
import Test from "../../5_Test/Test/Test";
import useWindowDimensions from "../../../../5_Helpers/UseWindowDimensions";
import { useParams } from 'react-router-dom';
import Page404 from "../../../1_Layout/Page404/Page404";
import { useMediaQuery } from "react-responsive";

interface WordsProps {
    user_localMemory: User_localMemory;
    preferences_localMemory: Preferences_localMemory;
    words_localMemory: Words_localMemory;
}

function Words(props: WordsProps): JSX.Element {

    const [localMemoryLoaded, setLocalMemoryLoaded] = useState<boolean>(false);
    const userUuid = props.user_localMemory.user?.uuid;

    let isMobile = useMediaQuery({ maxWidth: 577 });

    // Display Mode ------------------------------------------
    const [display, setDisplay] = useState<string>();
    const { displayMode } = useParams();

    // Close Settings ------------------------------------------
    const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false);

    function isOpenSettingsHandler() {
        setIsOpenSettings(!isOpenSettings);

        // Set Local Storage
        const openSettings = localStorage.getItem("openSettings") === 'false';
        localStorage.setItem("openSettings", openSettings.toString());

        // Set Height Of Settings
        if (isOpenSettings) { setHeightOfSortAndSelect(0); }
        else {
            setHeightOfSortAndSelect(516);
            setTimeout(() => { setHeightOfSortAndSelect(ref.current?.offsetHeight); }, 1);
        }
    }
    // Change Button Color
    const buttonSettingsClasses = isOpenSettings ? 'clicked-button' : 'unClicked-button';

    // useEffect ------------------------------------------
    useEffect(() => {
        // Get Local Storage
        const openSettings = localStorage.getItem("openSettings") === 'true';
        if (openSettings) { setIsOpenSettings(true); }

        // Display Mode
        switch (displayMode) {
            case 'list': {
                setDisplay('list');
                setIsClickedList(true);
                setIsClickedMediaPlayer(false);
                setIsClickedTest(false);
            }
                break;
            case 'media-player': {
                setDisplay('mediaPlayer');
                setIsClickedList(false);
                setIsClickedMediaPlayer(true);
                setIsClickedTest(false);
            }
                break;
            case 'test': {
                setDisplay('test');
                setIsClickedList(false);
                setIsClickedMediaPlayer(false);
                setIsClickedTest(true);
            }
        }

        // Checking whether the words and preferences came from the server.
        const interval = setInterval(
            function () {
                if (props.words_localMemory.words &&
                    props.preferences_localMemory.preferences &&
                    props.user_localMemory.user?.uuid) {
                    setLocalMemoryLoaded(true);
                    clearInterval(interval);
                }
            }
            , 1);

        /*
        Loading the user's information, 
        when he bought a subscription from another browser, 
        and did not reload the website in the first browser.
        */
        setTimeout(async () => {
            if (!props.words_localMemory.words && props.user_localMemory.token) {
                await props.user_localMemory.replaceToken();
                if ([0, 1, 3, 4].includes(props.user_localMemory.user.role)) {
                    props.preferences_localMemory.save();
                    props.words_localMemory.save();
                }
            }
        }, 10000);
    }, []);

    // Change Button Color ------------------------------------------
    const [isClickedList, setIsClickedList] = useState(false);
    const [isClickedMediaPlayer, setIsClickedMediaPlayer] = useState(false);
    const [isClickedTest, setIsClickedTest] = useState(false);

    const buttonListClasses = isClickedList ? 'clicked-button' : 'unClicked-button';
    const buttonMediaPlayerClasses = isClickedMediaPlayer ? 'clicked-button' : 'unClicked-button';
    const buttonTestClasses = isClickedTest ? 'clicked-button' : 'unClicked-button';

    const handleClick = (display: string) => {
        switch (display) {
            case 'list': {
                setIsClickedList(true);
                setIsClickedMediaPlayer(false);
                setIsClickedTest(false);
            }
                break;
            case 'mediaPlayer': {
                setIsClickedList(false);
                setIsClickedMediaPlayer(true);
                setIsClickedTest(false);
            }
                break;
            case 'test': {
                setIsClickedList(false);
                setIsClickedMediaPlayer(false);
                setIsClickedTest(true);
            }
        }
        setDisplay(display);
    };

    // Calculating the remaining height for the content ------------------------------------------
    // Calculating the height of the "SortAndSelect" component
    // https://stackoverflow.com/questions/73247936/how-to-dynamically-track-width-height-of-div-in-react-js
    // https://codesandbox.io/s/magical-johnson-i778pb
    const ref = useRef(null);
    const [heightOfSortAndSelect, setHeightOfSortAndSelect] = useState(0);
    useEffect(() => {
        // when the component gets mounted
        setHeightOfSortAndSelect(ref.current?.offsetHeight);
        // to handle page resize
        const getHeight = () => { setHeightOfSortAndSelect(ref.current?.offsetHeight); };
        window.addEventListener("resize", getHeight);
        // remove the event listener before the component gets unmounted
        return () => window.removeEventListener("resize", getHeight);
    }, [localMemoryLoaded]);

    // Calculating the height of the window
    // https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
    // https://codesandbox.io/s/34kr2rw285?file=/src/index.js:737-770
    const { height: heightOfWindow, width: widthOfWindow } = useWindowDimensions();

    // Calculate the height of the content
    let heightOfNavbar = 29.33;
    let heightOfButtons = 28;
    let heightOfContent = heightOfWindow - heightOfNavbar - heightOfSortAndSelect - heightOfButtons - 4;

    // Listening to the keyboard keys ------------------------------------------
    // const handleKeyDown = (event: KeyboardEvent) => {
    //     const key = event.key;
    //     if (key === "Shift") { isOpenSettingsHandler(); }
    // }
    // useEffect(() => {
    //     // Attach event listeners when the component mounts
    //     document.addEventListener('keydown', handleKeyDown);
    //     // Clean up event listeners when the component unmounts
    //     return () => { document.removeEventListener('keydown', handleKeyDown); };
    // });

    // Blocking Entry ------------------------------------------
    if (!props.user_localMemory.token) { return <Navigate to="/auth" />; }
    else if ([2, 5].includes(props.user_localMemory.user.role)) { return <Navigate to="/payment" />; }

    // ------------------------------------------
    return (
        <div className="Words" style={{ width: widthOfWindow }}>

            {localMemoryLoaded ? <>

                {/* Sort And Select */}
                <div ref={ref}>
                    {isOpenSettings &&
                        <SortAndSelect
                            words_localMemory={props.words_localMemory}
                            preferences_localMemory={props.preferences_localMemory}
                        />
                    }
                </div>

                {/* Buttons */}
                <div id="buttons">
                    <div className={buttonListClasses} onClick={() => handleClick('list')}>
                        {!isMobile && 'List '}
                        <i className={'fa-solid fa-list'}></i>
                    </div>
                    <div className={buttonMediaPlayerClasses} onClick={() => handleClick('mediaPlayer')}>
                        {!isMobile && 'Media Player '}
                        <i className={'fa-solid fa-music'}></i>
                    </div>
                    <div className={buttonTestClasses} onClick={() => handleClick('test')}>
                        {!isMobile && 'Test '}
                        <i className={'fa-solid fa-microscope'}></i>
                    </div>
                    <div className={buttonSettingsClasses} onClick={isOpenSettingsHandler}>
                        {!isMobile && 'Settings '}
                        <i className={'fa-solid fa-gear'}></i>
                    </div>
                </div>

                {/* Content */}
                <div id="content">
                    {(() => {
                        switch (display) {
                            case 'list':
                                return <List
                                    words_localMemory={props.words_localMemory}
                                    preferences_localMemory={props.preferences_localMemory}
                                    userUuid={userUuid}
                                    heightOfContent={heightOfContent}
                                />
                            case 'mediaPlayer':
                                return <MediaPlayer
                                    words_localMemory={props.words_localMemory}
                                    preferences_localMemory={props.preferences_localMemory}
                                    userUuid={userUuid}
                                    heightOfContent={heightOfContent}
                                />
                            case 'test':
                                return <Test
                                    words_localMemory={props.words_localMemory}
                                    preferences_localMemory={props.preferences_localMemory}
                                    userUuid={userUuid}
                                    heightOfContent={heightOfContent}
                                />
                            default:
                                return <Page404 />
                        }
                    })()}
                </div>

            </>
                :
                <div id="loadingDiv">
                    <p>Loading...</p>
                    <i className="fa-solid fa-w fa-flip"></i>
                </div>
            }

        </div>
    );
}

export default observer(Words);
