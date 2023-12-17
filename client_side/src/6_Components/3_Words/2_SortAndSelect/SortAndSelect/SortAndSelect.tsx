import { useForm } from "react-hook-form";
import "./SortAndSelect.css";
import { DisplaySettingsModel, InOrder, Picture, SortBy } from "../../../../1_Models/DisplaySettingsModel";
import errorMessages from "../../../../5_Helpers/ErrorMessages";
import { Words_localMemory } from "../../../../3_LocalMemory/Words_localMemory";
import { observer } from "mobx-react";
import { Preferences_localMemory } from "../../../../3_LocalMemory/Preferences_localMemory";
import RateSpeechOptions from "../../../SharedArea/RateSpeechOptions/RateSpeechOptions";

interface DisplaySettingsModel_and_rateSpeech {
    displaySettings: DisplaySettingsModel;
    rateSpeech: number;
}

interface SortAndSelectProps {
    words_localMemory: Words_localMemory;
    preferences_localMemory: Preferences_localMemory;
}

function SortAndSelect(props: SortAndSelectProps): JSX.Element {

    // Object to 'defaultValues' and 'displaySettings' -------------------------------------------
    let displaySettingsModel_and_rateSpeech: DisplaySettingsModel_and_rateSpeech = {
        displaySettings: {
            sort: {
                sortBy: SortBy.Date,
                inOrder: InOrder.Descending,
            },
            select: {
                category: "",
                picture: Picture.All,
                score: {
                    fromScore: 0,
                    toScore: 10
                },
                date: {
                    fromDate: "",
                    toDate: ""
                }
            },
            search: ""

        },
        rateSpeech: props.preferences_localMemory.preferences?.rateSpeech
    };

    // Use Form --------------------------------------------------------------------------------------
    const { register, handleSubmit, reset } =
        useForm<DisplaySettingsModel_and_rateSpeech>({
            defaultValues:
                props.words_localMemory.displaySettingsModel != null ?
                    {
                        displaySettings: props.words_localMemory.displaySettingsModel,
                        rateSpeech: props.preferences_localMemory.preferences?.rateSpeech
                    }
                    :
                    displaySettingsModel_and_rateSpeech,
        });

    async function submit(displaySettingsModel_and_rateSpeech: DisplaySettingsModel_and_rateSpeech) {
        if (displaySettingsModel_and_rateSpeech.rateSpeech != props.preferences_localMemory.preferences?.rateSpeech) {
            try {
                let preferences = {
                    ...props.preferences_localMemory.preferences,
                    rateSpeech: displaySettingsModel_and_rateSpeech.rateSpeech
                };
                await props.preferences_localMemory.update(preferences);
            }
            catch (error: any) {
                errorMessages(error);
            }
        }
        else {
            try {
                await props.words_localMemory.displaySettings(displaySettingsModel_and_rateSpeech.displaySettings);
                props.words_localMemory.updateCount();
            }
            catch (error: any) {
                errorMessages(error);
            }
        }
    }

    // Reset --------------------------------------------------------------------------------------
    function resetSortAndSelect(): void {
        reset(displaySettingsModel_and_rateSpeech);
        props.words_localMemory.displaySettings(displaySettingsModel_and_rateSpeech.displaySettings);
        props.words_localMemory.updateCount();
    }

    // --------------------------------------------------------------------------------------
    return (
        <div className="SortAndSelect">
            <form id="sortAndSelectForm" onChange={handleSubmit(submit)}>

                {/* 1 - Sort */}
                <div id="sortDiv">
                    <label>Sort</label>
                    <div>
                        <select {...register("displaySettings.sort.sortBy")}>
                            <option value={SortBy.Date}>Date</option>
                            <option value={SortBy.Alphabetically}>Alphabetically</option>
                            <option value={SortBy.Score}>Score</option>
                            <option value={SortBy.Category}>Category</option>
                            <option value={SortBy.Random}>Random</option>
                        </select>
                        <select {...register("displaySettings.sort.inOrder")}>
                            <option value={InOrder.Ascending}>Ascending</option>
                            <option value={InOrder.Descending}>Descending</option>
                        </select>
                    </div>
                </div>

                {/* 2 - Category */}
                <div id="categoryDiv">
                    <label> Category </label>
                    <select {...register("displaySettings.select.category")} >
                        <option value={""}>All</option>
                        {props.words_localMemory.categories?.map((c, index) => <option key={index} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* 3 - Picture */}
                <div id="pictureDiv" className="selectDiv">
                    <label> Picture </label>
                    <select {...register("displaySettings.select.picture")}>
                        <option value={0}>All</option>
                        <option value={1}>With Picture</option>
                        <option value={2}>Without Picture</option>
                    </select>
                </div>

                {/* 4 - Score */}
                <div id="scoreDiv" className="selectDiv">
                    <label>Score</label>
                    <div>
                        <div>
                            <label>From </label>
                            <select {...register("displaySettings.select.score.fromScore")}>
                                <option value={0}>0</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                            </select>
                        </div>
                        <div>
                            <label>&nbsp;To </label>
                            <select {...register("displaySettings.select.score.toScore")}>
                                <option value={0}>0</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 5 - Date */}
                <div id="dateDiv" className="selectDiv">
                    <label>Date</label>
                    <div>
                        <div>
                            <label>From  </label>
                            <input type="date" {...register("displaySettings.select.date.fromDate")} />
                        </div>
                        <div>
                            <label>&nbsp;To </label>
                            <input type="date" {...register("displaySettings.select.date.toDate")} />
                        </div>
                    </div>
                </div>

                {/* 6 - Search */}
                <div id="searchDiv">
                    <label>Search</label>
                    <input type="text" {...register("displaySettings.search")} />
                </div>

                {/* 7 - TotalWords */}
                <div id="totalWordsDiv">
                    <label>Total Words</label>
                    <div>
                        <span id="totalWordsSpan">{props.words_localMemory.count}</span>
                        <span id="resetSpan" onClick={resetSortAndSelect}>Reset <i className="fa-solid fa-arrow-rotate-left"></i></span>
                    </div>
                </div>

                {/* 8 - Rate Speech */}
                <div id="speedDiv">
                    <label>Speed of Speech</label>
                    <div>
                        <select {...register("rateSpeech")}>
                            <RateSpeechOptions />
                        </select>
                    </div>
                </div>
                
            </form>
        </div>
    );
}

export default observer(SortAndSelect);
