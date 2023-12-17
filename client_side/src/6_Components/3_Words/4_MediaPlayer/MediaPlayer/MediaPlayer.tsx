import "./MediaPlayer.css";
import { observer } from "mobx-react";
import { useEffect, RefObject, useRef, useState } from "react";
import { Words_localMemory } from "../../../../3_LocalMemory/Words_localMemory";
import { Preferences_localMemory } from "../../../../3_LocalMemory/Preferences_localMemory";
import WordModel from "../../../../1_Models/WordModel";
import { useSwipeable } from "react-swipeable";
import { useForm } from "react-hook-form";
import useWindowDimensions from "../../../../5_Helpers/UseWindowDimensions";
import questionMarkImg from "../../../../4_Assets/Images/questionMark.png";
import imageAndAudio_localMemory from "../../../../3_LocalMemory/imageAndAudio_localMemory";
import loadingImg from "../../../../4_Assets/Images/loading.gif";
import errorMessages from "../../../../5_Helpers/ErrorMessages";

interface RepeatModel {
    repeat: number;
}

interface SleepModel {
    sleep: number;
}

interface MediaPlayerProps {
    words_localMemory: Words_localMemory;
    preferences_localMemory: Preferences_localMemory;
    userUuid: string;
    heightOfContent: number;
}

function MediaPlayer(props: MediaPlayerProps): JSX.Element {
    const userUuid = props.userUuid;

    // Forms ------------------------------------------------------------------------------------------
    // Repeat
    const { register: registerRepeat, handleSubmit: handleSubmitRepeat, reset: resetRepeat } = useForm<RepeatModel>(
        { defaultValues: { repeat: 1 } }
    );
    const [sumRepeat, setSumRepeat] = useState<number>(1);
    const [leftRepeat, setLeftRepeat] = useState<number>(sumRepeat);

    function submitRepeat(repeat: RepeatModel): void {
        setLeftRepeat(0);
        if (repeat.repeat && (repeat.repeat < 1 || repeat.repeat > 99)) {
            resetRepeat({ repeat: 1 });
            setSumRepeat(1);
            return;
        }
        setSumRepeat(repeat.repeat);
    }

    // Sleep
    const { register: registerSleep, handleSubmit: handleSubmitSleep, reset: resetSleep } = useForm<SleepModel>(
        { defaultValues: { sleep: 0 } }
    );
    const [sleepTimeout, setSleepTimeout] = useState<NodeJS.Timeout>(null);
    const minute = 1000 * 60;

    function submitSleep(sleep: SleepModel): void {
        if (sleep.sleep && (sleep.sleep < 0 || sleep.sleep > 999)) {
            resetSleep({ sleep: 1 });
            sleep.sleep = 1;
        }
        if (!isPlay) { play() };
        if (sleepTimeout) { clearTimeout(sleepTimeout); }
        if (sleep.sleep > 0) { setSleepTimeout(setTimeout(stop, sleep.sleep * minute)) };
    }

    // Audio ------------------------------------------------------------------------------------
    const audioRef: RefObject<HTMLAudioElement> = useRef();
    const words = props.words_localMemory.words.filter(w => w.display === true);
    const sumOfWords = words.length;

    const [currentWord, setCurrentWord] = useState<WordModel>();
    const [currentIndex, setCurrentIndex] = useState<number>();
    const [isSentence, setIsSentence] = useState<boolean>(false);

    function setWord(index: number): void {
        setCurrentWord(words[index]);
        setCurrentIndex(index);
        getImage(words[index]?.picture);
        getAudioWord(words[index]?.speechWord);

        // Saving the audio of the next word. 
        const nextIndex = index === words.length - 1 ? 0 : index + 1;
        imageAndAudio_localMemory.saveImageAndAudio(userUuid, words[nextIndex]);
    }

    useEffect(() => {
        setWord(0);
        setIsSentence(true);
    }, [sumOfWords]);
    // -----------------------------
    function play(): void {
        if (currentWord) {
            audioRef.current.play();
            setIsPlay(true);
        }
    }

    function stop(): void {
        audioRef.current.pause();
        setIsPlay(false);
    }

    function next(): void {
        currentIndex < words.length - 1 ? setWord(currentIndex + 1) : setWord(0);
        setIsSentence(true);
        setIsPlay(true);
    }

    function previous(): void {
        currentIndex != 0 ? setWord(currentIndex - 1) : setWord(words.length - 1);
        setIsSentence(true);
        setIsPlay(true);
    }

    function end(): void {
        if (isSentence && currentWord?.speechSentence) {
            getAudioSentence(currentWord?.speechSentence);
            setIsSentence(false);
        }
        else {
            if (leftRepeat > 1) {
                getAudioWord(currentWord?.speechWord);
                setLeftRepeat(leftRepeat - 1);
            }
            else {
                currentIndex < words.length - 1 ? setWord(currentIndex + 1) : setWord(0);
                setLeftRepeat(sumRepeat);
            }
            setIsSentence(true);
        }
    }

    function setPlaybackRate(): void {
        audioRef.current.playbackRate = props.preferences_localMemory.preferences?.rateSpeech;
    }

    // Swipe ------------------------------------------------------------------------------------------
    // https://www.npmjs.com/package/react-swipeable
    const handlers = useSwipeable({
        onSwipedLeft: () => next(),
        onSwipedRight: () => previous(),
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    // Replacing the play/stop icon+play() -------------------------------------------------------------
    const [isPlay, setIsPlay] = useState<boolean>(true);
    function togglePlay(): void { isPlay ? stop() : play(); }

    // Hiding the translation --------------------------------------------------------------------------
    const [hideTranslation, setHideTranslation] = useState<boolean>(false);
    function toggleHideTranslation(): void { setHideTranslation(!hideTranslation); }
    const hideTranslationClass = hideTranslation ? 'hideTranslation' : '';

    // Listening to the keyboard keys ------------------------------------------------------------------
    const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key;
        if (key === " ") { isPlay ? stop() : play(); }
        if (key === "ArrowRight") { next(); }
        if (key === "ArrowLeft") { previous(); }
        if (key === "ArrowUp") { toggleHideTranslation(); }
        if (key === "ArrowDown") { toggleHideTranslation(); }
    }
    useEffect(() => {
        // Attach event listeners when the component mounts
        document.addEventListener('keydown', handleKeyDown);
        // Clean up event listeners when the component unmounts
        return () => { document.removeEventListener('keydown', handleKeyDown); };
    });
    // Width --------------------------------------------------------------------------------------------
    const { width: widthOfWindow } = useWindowDimensions();

    // Height -------------------------------------------------------------------------------------------
    const ref = useRef(null);
    const [heightOfSettings, setHeightOfSettings] = useState(0);
    useEffect(() => {
        setHeightOfSettings(ref.current?.offsetHeight);
        const getHeight = () => { setHeightOfSettings(ref.current?.offsetHeight); };
        window.addEventListener("resize", getHeight);
        return () => window.removeEventListener("resize", getHeight);
    });

    // Image Src -------------------------------------------------------------------------------------------
    const [imageSrc, setImageSrc] = useState<string>(loadingImg);

    async function getImage(imageName: string) {
        try {
            let srcImage = await imageAndAudio_localMemory.getImage(userUuid, imageName);
            setImageSrc(srcImage);
        }
        catch (err: any) {
            errorMessages(err);
        }
    }

    // Audio Src -------------------------------------------------------
    const [audioSrc, setAudioSrc] = useState<string>(null);

    // Word
    const [loadingWordAudio, setLoadingWordAudio] = useState<boolean>(false);

    async function getAudioWord(audioName: string) {
        try {
            setLoadingWordAudio(true);
            const src = await imageAndAudio_localMemory.getAudio(userUuid, audioName);
            setAudioSrc(src);
            setLoadingWordAudio(false);
        }
        catch (err: any) {
            errorMessages(err);
        }
    }

    // Sentence
    const [loadingSentenceAudio, setLoadingSentenceAudio] = useState<boolean>(false);

    async function getAudioSentence(audioName: string) {
        try {
            setLoadingSentenceAudio(true);
            const src = await imageAndAudio_localMemory.getAudio(userUuid, audioName);
            setAudioSrc(src);
            setLoadingSentenceAudio(false);
        }
        catch (err: any) {
            errorMessages(err);
        }
    }

    // -------------------------------------------------------------------------------------------
    return (
        <div className="MediaPlayer">
            {/* audio ------------------------------------------------------ */}
            <audio
                src={audioSrc}
                autoPlay
                ref={audioRef}
                onEnded={end}
                onCanPlay={() => setPlaybackRate()}
                onError={() => setIsPlay(false)}
                onPlay={() => setIsPlay(true)}
            />

            {/* settings ------------------------------------------------------ */}
            <div id="settings" ref={ref}>
                {/* Repeat */}
                <form onChange={handleSubmitRepeat(submitRepeat)}>
                    <label> Repeat  </label>
                    <input type="number" {...registerRepeat("repeat")}></input> times
                </form>

                {/* Sleep */}
                <form onChange={handleSubmitSleep(submitSleep)}>
                    <label> Sleep after </label>
                    <input type="number" {...registerSleep("sleep")}></input> minutes
                </form>
            </div>

            {/* Media Player ------------------------------------------------------ */}
            <div id="mediaPlayerDiv" {...handlers}
                style={{
                    width: widthOfWindow - 4,
                    height: props.heightOfContent - heightOfSettings - 0,
                    border: !isPlay && 'solid 1px rgb(21, 21, 21)'
                }}>
                {/* word ------------------------------------------------------ */}
                <div id="wordContainer" onClick={togglePlay}>

                    <div id="wordAndTranslationDiv" style={{ width: widthOfWindow - 30 }}>

                        <div dir="auto">
                            {currentWord?.word}
                            {loadingWordAudio && <div className="loading"><img src={loadingImg} /></div>}
                        </div>

                        <div dir="auto"
                            className={`translationDiv ${hideTranslationClass}`}>
                            {currentWord?.wordTranslation}
                        </div>

                    </div>

                    <div id="sentenceAndTranslationDiv" style={{ width: widthOfWindow - 30 }}>

                        <div>
                            <div dir="auto">
                                {currentWord?.sentence}
                                {loadingSentenceAudio && <div className="loading"><img src={loadingImg} /></div>}
                            </div>

                            <div dir="auto"
                                className={`translationDiv ${hideTranslationClass}`}>
                                {currentWord?.sentenceTranslation}
                            </div>
                        </div>

                    </div>

                    <div id="imgDiv" style={{ width: widthOfWindow - 14 }}>
                        {
                            currentWord?.picture
                                ?
                                hideTranslation
                                    ?
                                    <img src={questionMarkImg} style={{ border: 0 }} />
                                    :
                                    <img src={imageSrc} />
                                :
                                <></>
                        }
                    </div>

                </div>

                {/* controllers ------------------------------------------------------ */}
                <div id="controllersDiv">

                    {/* Sum */}
                    <div id="sumDiv">{currentIndex + 1}/{sumOfWords}</div>

                    {/* Controllers */}
                    <div id="playDiv">
                        <i className="fa-solid fa-backward" onClick={previous}></i>
                        {isPlay ?
                            <i className="fa-solid fa-stop" onClick={stop}></i>
                            :
                            <i className="fa-solid fa-play" onClick={play}></i>
                        }
                        <i className="fa-solid fa-forward" onClick={next}></i>
                    </div>

                    {/* Hiding Translation */}
                    <div id="hidingTranslationDiv">
                        {hideTranslation ?
                            <i className="fa-solid fa-eye-slash" onClick={toggleHideTranslation}></i>
                            :
                            <i className="fa-solid fa-eye" onClick={toggleHideTranslation}></i>
                        }
                    </div>

                </div>

            </div>
        </div>
    );
}

export default observer(MediaPlayer);
