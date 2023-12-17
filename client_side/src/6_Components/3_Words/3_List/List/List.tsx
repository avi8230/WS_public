import "./List.css";
import { Words_localMemory } from "../../../../3_LocalMemory/Words_localMemory";
import { useMediaQuery } from 'react-responsive';
import Card from "../Card/Card";
import { observer } from "mobx-react";
import { useEffect, RefObject, useRef, useState } from "react";
import Add from "../Add/Add";
import { Preferences_localMemory } from "../../../../3_LocalMemory/Preferences_localMemory";
import RowInTable from "../RowInTable/RowInTable";
import imageAndAudio_localMemory from "../../../../3_LocalMemory/imageAndAudio_localMemory";
import useWindowDimensions from "../../../../5_Helpers/UseWindowDimensions";

// https://stackoverflow.com/questions/57778950/how-to-load-more-search-results-when-scrolling-down-the-page-in-react-js
// https://www.npmjs.com/package/react-infinite-scroll-component
// npm install react-infinite-scroll-component
import InfiniteScroll from 'react-infinite-scroll-component';

interface ListProps {
    words_localMemory: Words_localMemory;
    preferences_localMemory: Preferences_localMemory;
    userUuid: string;
    heightOfContent: number;
}

function List(props: ListProps): JSX.Element {
    const words = props.words_localMemory.words;
    const userUuid = props.userUuid;

    // Display Mode ---------------------------------------------------------------------------
    // npm install react-responsive
    // https://chat.openai.com/c/180efffd-535b-4244-a155-5b6dccbfed4a
    let isMobile = useMediaQuery({ maxWidth: 895 });
    const [cardDisplay, setCardDisplay] = useState<boolean>(false);
    const [localStorageLoaded, setLocalStorageLoaded] = useState<boolean>(false);
    const buttonCardClasses = cardDisplay ? 'clicked-button' : 'unClicked-button';
    const buttonTableClasses = cardDisplay ? 'unClicked-button' : 'clicked-button';

    function setCardDisplayHandler(): void {
        setCardDisplay(!cardDisplay);
        // localStorage
        localStorage.setItem("cardMode", (!cardDisplay).toString());
    }

    // localStorage
    useEffect(() => {
        setCardDisplay(localStorage.getItem("cardMode") === 'true');
        setLocalStorageLoaded(true);
    }, []);

    // Audio Play Handler ---------------------------------------------------------------------
    const audioRef: RefObject<HTMLAudioElement> = useRef();
    const [src, setSrc] = useState<string>("");
    const [currentAudioName, setCurrentAudioName] = useState<string>("");
    const rateSpeech = props.preferences_localMemory.preferences?.rateSpeech;

    async function audioPlayHandler(audioName: string): Promise<void> {
        if (currentAudioName === audioName) {
            audioRef.current.load();
            audioRef.current.playbackRate = rateSpeech;
            audioRef.current.play();
        }
        else {
            let newSrc = await imageAndAudio_localMemory.getAudio(userUuid, audioName);
            setCurrentAudioName(audioName);
            setSrc(newSrc);
        }
    }

    // https://stackoverflow.com/questions/56247433/how-to-use-setstate-callback-on-react-hooks
    useEffect(() => {
        if (audioRef.current && src) {
            audioRef.current.load();
            audioRef.current.playbackRate = rateSpeech;
            audioRef.current.play();
        }
    }, [src]);

    // Hide Translation -------------------------------------------------------------------------
    const [hideTranslation, setHideTranslation] = useState<boolean>(false);
    function toggleHideTranslation(): void { setHideTranslation(!hideTranslation); }

    // -------------------------------------------------------------------------------------------
    let heightOfSettings = 33.5;

    // Loading additional words by scrolling to the end of the page. -----------------------------
    const [arrayOfIndexes, setArrayOfIndexes] = useState<number[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const { height: heightOfWindow, width: widthOfWindow } = useWindowDimensions();
    const [amountOfNewData, setAmountOfNewData] = useState<number>((Math.floor(heightOfWindow * widthOfWindow / 70000)));

    const fetchData = (indexStart: number) => {
        // I used setTimeout, so that the loading of the images would not be detected as a DDOS attack.
        if (indexStart === 0 || imageAndAudio_localMemory.allImagesLoaded)
            fetch(indexStart);
        else setTimeout(() => { fetch(indexStart); }, 1000);
    };

    function fetch(indexStart: number): void {
        const newData: number[] = [];
        let j = indexStart;
        let i = 0;

        while (i < amountOfNewData) {
            if (j === words.length) {
                setHasMore(false);
                break;
            }
            if (words[j].display === true) {
                newData.push(j);
                i++;
            }
            j++;
        }

        if (indexStart === 0) setArrayOfIndexes([...newData]);
        else setArrayOfIndexes([...arrayOfIndexes, ...newData]);

        setCurrentIndex(j);
    }

    useEffect(() => { fetchData(0); }, []);

    useEffect(() => {
        setAmountOfNewData((Math.floor(heightOfWindow * widthOfWindow / 90000)));
    }, [heightOfWindow, widthOfWindow]);

    useEffect(() => {
        setHasMore(true);
        fetchData(0);
    }, [props.words_localMemory.displaySettingsModel]);

    // Bug fix when a new word is added or a word is deleted.
    // This solution is problematic, because it causes the entire DOM to be reloaded.
    useEffect(() => {
        setHasMore(true);
        fetchData(0);
    }, [props.words_localMemory.words.length]);

    useEffect(() => {
        if (arrayOfIndexes.length === words.length) {
            imageAndAudio_localMemory.update_allImagesLoaded(true);
        }
    }, [arrayOfIndexes]);

    // ------------------------------------------------------------------------------------------
    return (
        <div className="List">

            {/* Audio ----------------------------------------------------------------------------- */}
            <audio src={src} ref={audioRef} />

            {/* Settings ----------------------------------------------------------------------------- */}
            <div id="settings">
                {/* Add */}
                <Add words_localMemory={props.words_localMemory} preferences_localMemory={props.preferences_localMemory} />
                {/* Hide Translation */}
                {hideTranslation ?
                    <i className="fa-solid fa-eye-slash" onClick={toggleHideTranslation}></i>
                    :
                    <i className="fa-solid fa-eye" onClick={toggleHideTranslation}></i>
                }
                {/* Display Mode */}
                {!isMobile &&
                    <div onClick={() => setCardDisplayHandler()}>
                        <i className={`fa-solid fa-table ${buttonTableClasses}`}></i>
                        <i className={`fa-solid fa-grip ${buttonCardClasses}`}></i>
                    </div>
                }
            </div>

            {/* Words ----------------------------------------------------------------------------- */}
            {localStorageLoaded &&
                <div id="words" style={{ height: props.heightOfContent - heightOfSettings }}>
                    <div id="startDiv" style={{ width: widthOfWindow - 4 }}></div>
                    {isMobile || cardDisplay ?

                        // Cards -----------------------------------------------------------------------------
                        <InfiniteScroll
                            dataLength={arrayOfIndexes.length}
                            next={() => { fetchData(currentIndex) }}
                            hasMore={hasMore}
                            loader={
                                <div>
                                    <p>Loading...</p>
                                    <i className="fa-solid fa-w fa-flip"></i>
                                </div>
                            }
                            scrollableTarget="words"
                        >
                            <div id="cardsDiv">
                                {
                                    arrayOfIndexes?.map(index => words[index]?.display && <Card
                                        key={words[index].uuid}
                                        word={words[index]}
                                        userUuid={props.userUuid}
                                        audioPlay={audioPlayHandler}
                                        words_localMemory={props.words_localMemory}
                                        preferences_localMemory={props.preferences_localMemory}
                                        hideTranslation={hideTranslation}
                                    />)
                                }
                            </div>

                        </InfiniteScroll>

                        :
                        // Table -----------------------------------------------------------------------------
                        <div className="Table">
                            <InfiniteScroll
                                dataLength={arrayOfIndexes.length}
                                next={() => { fetchData(currentIndex) }}
                                hasMore={hasMore}
                                loader={
                                    <div>
                                        <p>Loading...</p>
                                        <i className="fa-solid fa-w fa-flip"></i>
                                    </div>
                                }
                                scrollableTarget="words"
                            >
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Word</th>
                                            <th>Translation</th>
                                            <th>Picture</th>
                                            <th>Sentence</th>
                                            <th>Translation</th>
                                            <th>Score</th>
                                            <th>Category</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            arrayOfIndexes?.map(index => words[index]?.display && <RowInTable
                                                key={words[index].uuid}
                                                word={words[index]}
                                                userUuid={props.userUuid}
                                                audioPlay={audioPlayHandler}
                                                words_localMemory={props.words_localMemory}
                                                preferences_localMemory={props.preferences_localMemory}
                                                hideTranslation={hideTranslation}
                                            />)
                                        }
                                    </tbody>
                                </table>

                            </InfiniteScroll>
                        </div>
                    }
                    <div id="endDiv" style={{ width: widthOfWindow - 4 }}></div>
                </div>
            }

        </div>
    );
}

export default observer(List);
