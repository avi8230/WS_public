import "./Delete.css";
import { useState } from "react";
import Overlay from "../../../SharedArea/Overlay/Overlay";
import notify from "../../../../5_Helpers/NotifyMessages";
import errorMessages from "../../../../5_Helpers/ErrorMessages";
import words_localMemory from "../../../../3_LocalMemory/Words_localMemory"
import WordModel from "../../../../1_Models/WordModel";
import imageAndAudio_localMemory from "../../../../3_LocalMemory/imageAndAudio_localMemory";

interface DeleteProps {
    wordToDelete: WordModel;
}

function Delete(props: DeleteProps): JSX.Element {
    // Overlay --------------------------------
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
    };

    // Delete Handler --------------------------------
    const [loading, setLoading] = useState<boolean>(false);

    async function deleteHandler(word: WordModel): Promise<void> {
        try {
            setLoading(true);
            const message = await words_localMemory.delete(word.uuid);
            words_localMemory.updateCount();
            imageAndAudio_localMemory.delete(word)
            notify.success(message);
            words_localMemory.updateCategories();
            setLoading(false);
        }
        catch (error: any) {
            errorMessages(error);
        }
    }

    // Button style when loading ----------------------------------------------------------------
    const buttonLoadingStyle = {
        color: "black",
        backgroundColor: "red",
        border: "1px solid red"
    };
    
    // --------------------------------
    return (
        <div className="Delete">

            <i className="fa-solid fa-trash-can" onClick={toggleOverlay}></i>

            <Overlay isOpen={isOpen} onClose={toggleOverlay}>
                <div id="container">

                    <div id="textDiv">
                        Delete the word:
                        <br />
                        <span>{props.wordToDelete.word}</span>
                    </div>

                    <div id="buttonsDiv">
                        <span id="closeSpan" onClick={toggleOverlay}>Close</span>
                        {
                            loading ?
                                <button><i className="fa-solid fa-trash-can fa-flip" style={buttonLoadingStyle}></i></button>
                                :
                                <button><i className="fa-solid fa-trash-can" onClick={() => deleteHandler(props.wordToDelete)}></i></button>
                        }
                    </div>

                </div>
            </Overlay>

        </div>
    );
}

export default Delete;
