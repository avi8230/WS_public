import { action, makeObservable, observable, runInAction } from "mobx";
import imageAndAudio_webAccess from "../2_WebAccess/ImageAndAudio_webAccess";
import WordModel from "../1_Models/WordModel";

type KeyType = string;
type ValueType = string;

export class ImageAndAudio_localMemory {

    @observable
    public images: Map<KeyType, ValueType> = new Map();
    public audios: Map<KeyType, ValueType> = new Map();
    public allImagesLoaded: boolean = false;

    public constructor() {
        makeObservable(this);
    }

    @action
    public async getImage(userUuid: string, imageName: string): Promise<string> {
        if (!imageName) return;

        if (this.images.has(imageName))
            return this.images.get(imageName);

        const base64Image = await imageAndAudio_webAccess.getImage(userUuid, imageName);
        runInAction(() => { this.images.set(imageName, base64Image); });
        return base64Image;
    }

    @action
    public async getAudio(userUuid: string, audioName: string): Promise<string> {
        if (!audioName) return;

        if (this.audios.has(audioName))
            return this.audios.get(audioName);

        const base64Audio = await imageAndAudio_webAccess.getAudio(userUuid, audioName);
        runInAction(() => { this.audios.set(audioName, base64Audio) });
        return base64Audio;
    }

    @action
    public async delete(word: WordModel): Promise<void> {
        this.images.delete(word?.picture);
        this.audios.delete(word?.speechWord);
        this.audios.delete(word?.speechSentence);
    }

    @action
    public async deleteAll(): Promise<void> {
        this.images.clear();
        this.audios.clear();
    }

    @action
    public async saveImageAndAudio(userUuid: string, word: WordModel) {

        const picture = word?.picture;
        const speechWord = word?.speechWord;
        const speechSentence = word?.speechSentence;

        if (picture && !this.images.has(picture)) {
            const base64Image = await imageAndAudio_webAccess.getImage(userUuid, picture);
            runInAction(() => { this.images.set(picture, base64Image) });
        }

        if (speechWord && !this.audios.has(speechWord)) {
            const base64AudioWord = await imageAndAudio_webAccess.getAudio(userUuid, speechWord);
            runInAction(() => { this.audios.set(speechWord, base64AudioWord) });
        }

        if (speechSentence && !this.audios.has(speechSentence)) {
            const base64AudioSentence = await imageAndAudio_webAccess.getAudio(userUuid, speechSentence);
            runInAction(() => { this.audios.set(speechSentence, base64AudioSentence) });
        }
    }

    @action
    public update_allImagesLoaded(isAllImagesLoaded: boolean): void {
        this.allImagesLoaded = isAllImagesLoaded;
    }
}

const imageAndAudio_localMemory = new ImageAndAudio_localMemory();

export default imageAndAudio_localMemory;