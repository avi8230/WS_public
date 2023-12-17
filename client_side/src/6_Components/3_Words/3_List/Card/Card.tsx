import "./Card.css";
import { useMediaQuery } from "react-responsive";
import WordModel from "../../../../1_Models/WordModel";
import { Preferences_localMemory } from "../../../../3_LocalMemory/Preferences_localMemory";
import { Words_localMemory } from "../../../../3_LocalMemory/Words_localMemory";
import useWindowDimensions from "../../../../5_Helpers/UseWindowDimensions";
import Delete from "../Delete/Delete";
import Update from "../Update/Update";
import { SyntheticEvent, useState, useEffect } from "react";
import questionMarkImg from "../../../../4_Assets/Images/questionMark.png";
import errorMessages from "../../../../5_Helpers/ErrorMessages";
import imageAndAudio_localMemory from "../../../../3_LocalMemory/imageAndAudio_localMemory";
import noPictureImg from "../../../../4_Assets/Images/noPicture.png";
import loadingImg from "../../../../4_Assets/Images/loading.gif";

interface CardProps {
    word: WordModel;
    userUuid: string;
    audioPlay: (audioName: string) => Promise<void>;
    words_localMemory: Words_localMemory;
    preferences_localMemory: Preferences_localMemory;
    hideTranslation: boolean;
}

function Card(props: CardProps): JSX.Element {
    const word = props.word;
    const userUuid = props.userUuid;

    // The width of the div in mobile -------------------------------------------------------
    const { width: widthOfWindow } = useWindowDimensions();
    let isMobile = useMediaQuery({ maxWidth: 610 });

    // Hide Translation -------------------------------------------------------
    const hideTranslationClass = props.hideTranslation ? 'hideTranslation' : '';

    function hideTranslationHandler(args: SyntheticEvent): void {
        const classes = (args.target as HTMLInputElement).classList;
        if (classes.contains("hideTranslation")) classes.remove("hideTranslation");
        else classes.add("hideTranslation");
    }

    // Hide Image
    const [hideImage, setHideImage] = useState<boolean>(props.hideTranslation);

    function hideImageHandler() { setHideImage(!hideImage); }

    useEffect(() => {
        setHideImage(props.hideTranslation);
    }, [props.hideTranslation]);

    // Image Src -------------------------------------------------------
    const [imageSrc, setImageSrc] = useState<string>(loadingImg);

    async function getImage() {
        try {
            let srcImage = await imageAndAudio_localMemory.getImage(userUuid, word.picture);
            setImageSrc(srcImage);
        }
        catch (err: any) {
            errorMessages(err);
        }
    }

    useEffect(() => { getImage(); }, []);

    // Audio Play -------------------------------------------------------
    // Word
    const [loadingWordAudio, setLoadingWordAudio] = useState<boolean>(false);

    async function playWord() {
        try {
            setLoadingWordAudio(true);
            await props.audioPlay(word.speechWord);
            setLoadingWordAudio(false);
        }
        catch (err: any) {
            errorMessages(err);
        }
    }

    // Sentence
    const [loadingSentenceAudio, setLoadingSentenceAudio] = useState<boolean>(false);

    async function playSentence() {
        try {
            if (word.speechSentence) {
                setLoadingSentenceAudio(true);
                await props.audioPlay(word.speechSentence);
                setLoadingSentenceAudio(false);
            }
        }
        catch (err: any) {
            errorMessages(err);
        }
    }

    // Update Image -----------------------------------------------------------------------
    async function updateImage(imageName: string): Promise<void> {
        let srcImage = await imageAndAudio_localMemory.getImage(userUuid, imageName);
        setImageSrc(srcImage);
    }

    // -----------------------------------------------------------------------
    return (
        <div className="Card" style={{ width: isMobile && widthOfWindow - 12 }}>

            <div className="wordContainer">
                <div
                    className="wordDiv"
                    onClick={playWord}
                    dir="auto">
                    {word.word}
                    {loadingWordAudio && <div className="loading"><img src={loadingImg} /></div>}
                </div>
                <div
                    className={`wordTranslationDiv ${hideTranslationClass}`}
                    onClick={hideTranslationHandler}
                    dir="auto">
                    {word.wordTranslation}
                </div>
            </div>

            <div className="sentenceContainer">
                <div
                    className="sentenceDiv"
                    onClick={playSentence}
                    dir="auto">
                    {word.sentence}
                    {loadingSentenceAudio && <div className="loading"><img src={loadingImg} /></div>}
                </div>
                <div
                    className={`sentenceTranslationDiv ${hideTranslationClass}`}
                    onClick={hideTranslationHandler}
                    dir="auto">
                    {word.sentenceTranslation}
                </div>
            </div>

            <div className="pictureAndInformationDiv">
                <div className="deleteAndUpdateDiv">
                    <Update
                        wordToUpdate={word}
                        words_localMemory={props.words_localMemory}
                        preferences_localMemory={props.preferences_localMemory}
                        userUuid={props.userUuid}
                        ifFixImagePosition={true}
                        updateImage={updateImage}
                    />
                    <Delete wordToDelete={word} />
                </div>

                <div className="informationDiv">
                    <div>Score: {word.score}</div>
                    <div>Category: {word.category}</div>
                    <div>{word.date.slice(0, 10)}</div>
                </div>

                <div className="pictureDiv" onClick={hideImageHandler}>
                    {
                        word.picture ?
                            hideImage ?
                                <img src={questionMarkImg} />
                                :
                                <img src={imageSrc} />
                            :
                            <img src={noPictureImg} />
                    }
                </div>
            </div>
        </div>
    );
}

export default Card;
