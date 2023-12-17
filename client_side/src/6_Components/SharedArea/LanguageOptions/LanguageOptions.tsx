import "./LanguageOptions.css";
import { languagesAndVoices } from "../LanguagesAndVoices";

function LanguageOptions(): JSX.Element {

    return (
        <>
            {languagesAndVoices?.map((item, index) =>
                <option key={index} value={item.language.value}>
                    {item.language.name}
                </option>
            )}
        </>
    );
}

export default LanguageOptions;
