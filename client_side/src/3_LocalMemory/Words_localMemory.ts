import { action, makeObservable, observable, runInAction } from "mobx";
import WordModel from "../1_Models/WordModel";
import words_WebAccess from "../2_WebAccess/Words_webAccess";
import { DisplaySettingsModel, InOrder, Picture, SortBy } from "../1_Models/DisplaySettingsModel";

export class Words_localMemory {

    @observable
    public words: WordModel[] = null;
    @observable
    public count: number = 0;
    @observable
    public categories: string[] = null;
    @observable
    public displaySettingsModel: DisplaySettingsModel = null;

    public constructor() {
        makeObservable(this);
    }

    @action
    public async save(): Promise<void> {
        if (!this.words) {
            const words = await words_WebAccess.get();
            runInAction(() => {
                // save words
                this.words = words;

                // displaySettings
                let displaySettings: DisplaySettingsModel = {
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
                };
                this.displaySettings(displaySettings);

                // save categories
                this.categories = [];
                this.words.forEach((word) => {
                    if (word.category && !this.categories.includes(word.category)) {
                        this.categories.push(word.category);
                    }
                })

                // updateCount
                this.updateCount();
            });
        }
    }

    @action
    public async add(word: WordModel): Promise<string> {
        const newWord = await words_WebAccess.add(word);
        runInAction(() => {
            newWord.display = true;
            this.words.unshift(newWord);
        });
        return `The word "${newWord.word}" has been successfully added!`;
    }

    @action
    public async update(word: WordModel): Promise<WordModel> {
        const updateWord = await words_WebAccess.update(word);
        runInAction(() => {
            const index = this.words.findIndex(w => w.uuid === word.uuid);
            updateWord.display = true;
            this.words[index] = updateWord;
        });
        return updateWord;
    }

    @action
    public async updateScore(uuid: string, score: number): Promise<void> {
        const updateScore = await words_WebAccess.updateScore(uuid, score);
        runInAction(() => {
            const index = this.words.findIndex(w => w.uuid === uuid);
            this.words[index].score = updateScore;
        });
    }

    @action
    public async delete(uuid: string): Promise<string> {
        await words_WebAccess.delete(uuid);
        runInAction(() => {
            const index = this.words.findIndex(w => w.uuid === uuid);
            this.words.splice(index, 1);
        });
        return "The word was successfully deleted!";
    }

    // --------------------------------------------------------------------------------
    @action
    public async displaySettings(displaySettings: DisplaySettingsModel): Promise<void> {

        this.displaySettingsModel = displaySettings;

        // Sort ----------------------------
        switch (+displaySettings.sort.sortBy) {
            case SortBy.Alphabetically: {
                this.words.sort((a, b) => a.word.localeCompare(b.word));
            }
                break;
            case SortBy.Score: {
                this.words.sort((a, b) => a.score - b.score);
            }
                break;
            case SortBy.Date: {
                this.words.sort((a, b) => a.date.localeCompare(b.date));
            }
                break;
            case SortBy.Category: {
                this.words.sort((a, b) => a.category.localeCompare(b.category));
            }
                break;
            case SortBy.Random: {
                this.words.sort(() => Math.random() - 0.5);
            }
                break;
        }
        if (+displaySettings.sort.inOrder === InOrder.Descending) { this.words.reverse(); }

        // Select ----------------------------
        let category = displaySettings.select.category;
        let picture = +displaySettings.select.picture;
        let fromScore = displaySettings.select.score.fromScore;
        let toScore = displaySettings.select.score.toScore;
        let fromDate = displaySettings.select.date.fromDate;
        let toDate = displaySettings.select.date.toDate;
        let search = displaySettings.search.trim();

        this.words.forEach(function (word) {
            if (search) {
                search = search.toLowerCase();
                if (word.word.toLowerCase().trim().startsWith(search) ||
                    word.wordTranslation.toLowerCase().trim().startsWith(search)) {
                    word.display = true;
                }
                else { word.display = false; }
            }
            else {
                let dateCheck = word.date.slice(0, 10);

                if (
                    (!category || word.category === category) &&
                    (!picture || (picture === 1 && word.picture) || (picture === 2 && !word.picture)) &&
                    (word.score >= fromScore && word.score <= toScore) &&
                    (!fromDate || Words_localMemory.dateCheck(fromDate, toDate, dateCheck))
                ) {
                    word.display = true;
                }
                else { word.display = false; }
            }

            // set "No category"
            if (!word.category) { word.category = "No Category" }
        });
    }

    private static dateCheck(from: string, to: string, check: string): boolean {
        let f, t, c;
        f = Date.parse(from);
        t = Date.parse(to);
        c = Date.parse(check);
        return (c <= t && c >= f);
    }

    // --------------------------------------------------------------------------------
    @action
    public updateCount(): void {
        this.count = this.words.filter(w => w.display).length;
    }

    @action isExists(word: string): boolean {
        return this.words.some(w => w.word.toLowerCase().trim() === word.toLowerCase().trim());
    }

    @action
    public updateCategories(category?: string): void {
        if (category && !this.categories.includes(category)) {
            this.categories.push(category);
        }
        else {
            this.categories = [];
            this.words.forEach((word) => {
                if (word.category && !this.categories?.includes(word.category)) {
                    this.categories.push(word.category);
                }
            })
        }
    }

    @action
    public clearMemory(): void {
        this.words = null;
        this.count = 0;
        this.categories = null;
        this.displaySettingsModel = null;
    }
}

const words_localMemory = new Words_localMemory();

export default words_localMemory;