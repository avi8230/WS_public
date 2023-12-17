import "./Update.css";
import { useEffect, SyntheticEvent, useState } from "react";
import WordModel from "../../../../1_Models/WordModel";
import { Preferences_localMemory } from "../../../../3_LocalMemory/Preferences_localMemory";
import { Words_localMemory } from "../../../../3_LocalMemory/Words_localMemory";
import errorMessages from "../../../../5_Helpers/ErrorMessages";
import notify from "../../../../5_Helpers/NotifyMessages";
import LanguageOptions from "../../../SharedArea/LanguageOptions/LanguageOptions";
import VoiceOptions from "../../../SharedArea/VoiceOptions/VoiceOptions";
import { useForm } from "react-hook-form";
import Overlay from "../../../SharedArea/Overlay/Overlay";
import { languagesAndVoices } from "../../../SharedArea/LanguagesAndVoices";
import { FileUploader } from "react-drag-drop-files";
import { observer } from "mobx-react";
import { useMediaQuery } from "react-responsive";
import imageAndAudio_localMemory from "../../../../3_LocalMemory/imageAndAudio_localMemory";

interface UpdateProps {
    wordToUpdate: WordModel;
    words_localMemory: Words_localMemory;
    preferences_localMemory: Preferences_localMemory;
    userUuid: string;
    ifFixImagePosition: boolean;
    updateImage: (imageName: string) => Promise<void>;
}

function Update(props: UpdateProps): JSX.Element {
    // Form --------------------------------
    const { register, handleSubmit, formState, reset } = useForm<WordModel>({
        defaultValues: {
            word: props.wordToUpdate.word,
            wordTranslation: props.wordToUpdate.wordTranslation,
            sentence: props.wordToUpdate.sentence,
            sentenceTranslation: props.wordToUpdate.sentenceTranslation,
            language: props.wordToUpdate.language,
            voice: props.wordToUpdate.voice,
            category: props.wordToUpdate.category
        }
    });

    // Submit
    const [loading, setLoading] = useState<boolean>(false);
    const [newCategory, setNewCategory] = useState<string>("");

    async function submit(word: WordModel) {
        try {
            // Checking that the voice corresponds to the language
            if (word.language.slice(0, 5) != word.voice.slice(0, 5)) {
                notify.error("Please select a Voice.");
                return;
            }
            if (newCategory?.length > 20) return;
            setLoading(true);

            // Update the word
            word.uuid = props.wordToUpdate.uuid;
            word.highQuality = props.preferences_localMemory.preferences.highQuality;
            if (myImage) word.myImage = myImage;

            if (newCategory) word.category = newCategory;
            else if (!word.category) word.category = "No";

            const updateWord = await props.words_localMemory.update(word);
            notify.success(`The word "${updateWord.word}" has been successfully updated!`);

            // Saving the preferences.language + preferences.voice
            const preferences = {
                ...props.preferences_localMemory.preferences,
                language: word.language,
                voice: word.voice
            };
            await props.preferences_localMemory.update(preferences);

            props.updateImage(updateWord.picture);
            props.words_localMemory.updateCount();
            setNewCategory(null);
            if (word.category) props.words_localMemory.updateCategories(word.category);
            reset({ category: word.category });
            setLoading(false);
        }
        catch (error: any) {
            errorMessages(error);
            setLoading(false);
        }
    }

    // Change Voice Options --------------------------------
    const [selectedLanguage, setSelectedLanguage] = useState<string>(props.wordToUpdate?.language);

    function changeVoiceOptionsHandler(args: SyntheticEvent) {
        let selectedLanguage = (args.target as HTMLSelectElement).value;
        setSelectedLanguage(selectedLanguage);

        // Default Voice
        let defaultVoice = "";
        if (selectedLanguage === props.wordToUpdate.language) {
            defaultVoice = props.wordToUpdate.voice;
        }
        else {
            let index = languagesAndVoices.findIndex(item => item.language.value === selectedLanguage);
            defaultVoice = languagesAndVoices[index].voices[0].value;
        }
        reset({
            voice: defaultVoice
        });
    }

    // Displaying image --------------------------------
    const [imageSource, setImageSource] = useState<string>(null);

    // old picture
    async function getImage() {
        if (props.wordToUpdate.picture) {
            try {
                let srcImage = await imageAndAudio_localMemory.getImage(props.userUuid, props.wordToUpdate.picture);
                setImageSource(srcImage);
            }
            catch (err: any) {
                errorMessages(err);
            }
        }
    }

    // new picture
    const [myImage, setMyImage] = useState<File>(null);
    const fileTypes = ["JPG", "PNG", "GIF", "jpeg", "avif", "jfif", "pjpeg", "pjp", "apng", "webp"];

    function previewHandler(image: File): void {

        setMyImage(image); // to send to the server

        const fileReader = new FileReader();
        fileReader.onload = (event: ProgressEvent) => {
            const base64Image = (event.target as FileReader).result.toString();
            setImageSource(base64Image);
        }
        fileReader.readAsDataURL(image);
    };

    // Overlay --------------------------------
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleOverlay = () => {
        reset({
            word: props.wordToUpdate.word,
            wordTranslation: props.wordToUpdate.wordTranslation,
            sentence: props.wordToUpdate.sentence,
            sentenceTranslation: props.wordToUpdate.sentenceTranslation,
            language: props.wordToUpdate.language,
            voice: props.wordToUpdate.voice,
            category: props.wordToUpdate.category
        })
        getImage();
        setIsOpen(!isOpen);
    };

    // Is Exists + Help Links --------------------------------
    const [wordExists, setWordExists] = useState<boolean>(false);
    const [wordInput, setWordInput] = useState<string>(props.wordToUpdate.word);
    const [sentenceInput, setSentenceInput] = useState<string>(props.wordToUpdate.sentence);

    function isExistsHandler(args: SyntheticEvent): void {
        const word = (args.target as HTMLInputElement).value;
        if (word != props.wordToUpdate.word) {
            const exists = props.words_localMemory.isExists(word);
            exists ? setWordExists(true) : setWordExists(false);
        }

        setWordInput(word);
    }

    function setSentenceInputHandler(args: SyntheticEvent): void {
        const sentence = (args.target as HTMLInputElement).value;
        setSentenceInput(sentence);
    }

    // Set New Category --------------------------------
    function setNewCategoryHandler(args: SyntheticEvent): void {
        const category = (args.target as HTMLInputElement).value;
        setNewCategory(category);
    }

    // Setting the text in "FileUploader" --------------------------------
    let isMobile = useMediaQuery({ maxWidth: 417 });

    // Fix Image Position --------------------------------
    const transformStyle = props.ifFixImagePosition && !isMobile ? { transform: `translate(${-48}px, ${-0.5}px)` } : {};

    // Button style when loading ----------------------------------------------------------------
    const buttonLoadingStyle = {
        color: "black",
        backgroundColor: "rgb(82, 255, 47)",
        border: "1px solid rgb(82, 255, 47)"
    };

    // ----------------------------------------------------------------
    return (
        <span className="Update">
            <i className="fa-regular fa-pen-to-square" onClick={toggleOverlay}></i>
            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                <form onSubmit={handleSubmit(submit)}>

                    <div>
                        {/* 1 - Word */}
                        <div>
                            <label id="wordLabel" htmlFor="wordInput">Word </label>
                            <div>
                                <div className="errorMessage">
                                    <span> {wordExists ? "The word already exists. " : ""} </span>
                                    <span>{formState.errors.word?.message}</span>
                                </div>
                                <input
                                    id="wordInput"
                                    type="text"
                                    dir="auto"
                                    {...register("word", {
                                        required: { value: true, message: "Missing Word. " },
                                        maxLength: { value: 100, message: "Up to 100 chars. " }
                                    })}
                                    onChange={isExistsHandler}
                                />
                            </div>
                        </div>

                        {/* 2 - Translation */}
                        <div>
                            <label className="translationLabel" htmlFor="translationInput">Translation </label>
                            <div>
                                <div className="errorMessage">{formState.errors.wordTranslation?.message}</div>
                                <input
                                    id="translationInput"
                                    type="text"
                                    dir="auto"
                                    {...register("wordTranslation", {
                                        maxLength: { value: 100, message: "Up to 100 chars. " }
                                    })}
                                />
                            </div>
                            <a className="translationA" href={`https://translate.google.com/?sl=en&tl=iw&text=${wordInput}&op=translate`} target="_blank">Translate</a>
                        </div>

                        {/* 3 - Sentence */}
                        <div>
                            <label id="sentenceLabel" htmlFor="sentenceTextarea">Sentence </label>
                            <div>
                                <div className="errorMessage">{formState.errors.sentence?.message}</div>
                                <textarea
                                    id="sentenceTextarea"
                                    dir="auto"
                                    {...register("sentence", {
                                        maxLength: { value: 1000, message: "Up to 1000 chars. " }
                                    })}
                                    onChange={setSentenceInputHandler}
                                ></textarea>
                            </div>
                            <div id="sentenceDivA">
                                <a href={`https://www.oxfordlearnersdictionaries.com/definition/english/${wordInput}_1?q=${wordInput}`} target="_blank">Sentences 1</a>
                                <a href={`https://sentence.yourdictionary.com/${wordInput}`} target="_blank">Sentences 2</a>
                            </div>
                        </div>

                        {/* 4 - Translation */}
                        <div>
                            <label className="translationLabel" htmlFor="translationTextarea">Translation </label>
                            <div>
                                <div className="errorMessage">{formState.errors.sentenceTranslation?.message}</div>
                                <textarea
                                    id="translationTextarea"
                                    dir="auto"
                                    {...register("sentenceTranslation", {
                                        maxLength: { value: 1000, message: "Up to 1000 chars. " }
                                    })}>
                                </textarea>
                            </div>
                            <a className="translationA" href={`https://translate.google.com/?sl=en&tl=iw&text=${sentenceInput}&op=translate`} target="_blank">Translate</a>
                        </div>

                        {/* 5 - Picture */}
                        <div id="pictureDiv">
                            <label id="pictureLabel">Picture</label>
                            <div>
                                <div>
                                    <FileUploader
                                        handleChange={previewHandler}
                                        types={fileTypes}
                                        children={<div id="fileUploader">{isMobile ? `Drag or Select` : "Drag an image here, or click to select."}</div>}
                                    />
                                    <div id="imgDiv">
                                        {imageSource ?
                                            <>
                                                <img id='imgUpdate' src={imageSource} style={transformStyle} />
                                                <i className="fa-solid fa-xmark"
                                                    onClick={() => { setImageSource(""); setMyImage(null); }}></i>
                                            </>
                                            :
                                            <></>}
                                    </div>
                                </div>
                                <a id="pictureA" href={`https://www.google.co.il/search?q=${wordInput}&newwindow=1&hl=iw&authuser=0&tbm=isch&sxsrf=AB5stBhij1cjd3mZLhIHGZawLzmaMvftSA%3A1688891509574&source=hp&biw=1279&bih=1271&ei=dXCqZIn9IMjkxc8Ptfy1oAg&iflsig=AD69kcEAAAAAZKp-hYStKlzIu200UVP20itWW70ek2xe&ved=0ahUKEwjJi_aTm4GAAxVIcvEDHTV-DYQQ4dUDCAc&uact=5&oq=test&gs_lcp=CgNpbWcQAzIECCMQJzIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDoHCCMQ6gIQJzoICAAQgAQQsQNQ6QpY_BVgmBtoAXAAeACAAaIBiAGTBJIBAzAuNJgBAKABAaoBC2d3cy13aXotaW1nsAEK&sclient=img`} target="_blank">Images</a>
                            </div>
                        </div>

                        <div id="categoryAndNewCategoryDiv">
                            {/* 6 - Category */}
                            <div>
                                <label htmlFor="categorySelect">Category </label>
                                <select id="categorySelect" {...register("category")} >
                                    {
                                        !props.words_localMemory.categories.includes("No Category")
                                        &&
                                        <option value={"No Category"}>No Category</option>
                                    }
                                    {props.words_localMemory.categories?.map((c, index) => <option key={index} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* 7 - New Category */}
                            <div id="newCategoryDiv">
                                <label id="newCategoryLabel" htmlFor="newCategoryInput">New Category </label>
                                <div>
                                    {(newCategory?.length > 20) && <div className="errorMessage">Up to 20 chars. </div>}
                                    <input id="newCategoryInput" type="text" dir="auto" onChange={setNewCategoryHandler} />
                                </div>
                            </div>
                        </div>

                        <div id="languageAndVoiceDiv">
                            {/* 8 - Language */}
                            <div>
                                <label htmlFor="languageSelect">Language </label>
                                <select
                                    id="languageSelect"
                                    onChangeCapture={changeVoiceOptionsHandler}
                                    {...register("language")}>
                                    <LanguageOptions />
                                </select>
                            </div>

                            {/*  9 - Voice */}
                            <div id="voiceDiv">
                                <label htmlFor="voiceSelect">Voice </label>
                                <select
                                    id="voiceSelect"
                                    {...register("voice")}>
                                    <VoiceOptions language={selectedLanguage} />
                                </select>
                            </div>
                        </div>

                    </div>

                    {/* 10 - Buttons */}
                    <div id="buttonsDiv">
                        <span id="closeSpan" onClick={toggleOverlay}>Close</span>
                        {
                            loading ?
                                <button><i className="fa-regular fa-pen-to-square fa-flip" style={buttonLoadingStyle}></i></button>
                                :
                                <button><i className="fa-regular fa-pen-to-square"></i></button>
                        }
                    </div>

                </form>
            </Overlay>
        </span>
    );
}

export default observer(Update);
