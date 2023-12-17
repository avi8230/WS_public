import axios from 'axios';
import WordModel from "../1_Models/WordModel";
import urls from './Urls';

class Words_webAccess {

    public async get(): Promise<WordModel[]> {
        const response = await axios.get<WordModel[]>(urls.words.getWords);
        const words = response.data;
        return words;
    }

    public async add(word: WordModel): Promise<WordModel> {
        const formData = new FormData();
        formData.append("word", word.word.trim());
        formData.append("wordTranslation", word.wordTranslation.trim());
        formData.append("sentence", word.sentence.trim());
        formData.append("sentenceTranslation", word.sentenceTranslation.trim());
        formData.append("myImage", word.myImage);
        formData.append("language", word.language);
        formData.append("voice", word.voice);
        formData.append("highQuality", word.highQuality.toString());
        formData.append("category", word.category);
        const response = await axios.post<WordModel>(urls.words.add, formData);
        const newWord = response.data;
        return newWord;
    }

    public async update(word: WordModel): Promise<WordModel> {
        const formData = new FormData();
        formData.append("word", word.word.trim());
        formData.append("wordTranslation", word.wordTranslation.trim());
        formData.append("sentence", word.sentence.trim());
        formData.append("sentenceTranslation", word.sentenceTranslation.trim());
        formData.append("myImage", word.myImage);
        formData.append("language", word.language);
        formData.append("voice", word.voice);
        formData.append("highQuality", word.highQuality.toString());
        formData.append("category", word.category);
        const response = await axios.put<WordModel>(urls.words.updateWord + word.uuid, formData);
        const updateWord = response.data;
        return updateWord;
    }

    public async updateScore(uuid: string, score: number): Promise<number> {
        const response = await axios.patch<number>(`${urls.words.updateScore}${uuid}/${score}`);
        const updateScore = response.data;
        return updateScore;
    }

    public async delete(uuid: string): Promise<number> {
        const response = await axios.delete(urls.words.delete + uuid);
        const status = response.status;
        return status;
    }
}

const words_webAccess = new Words_webAccess();

export default words_webAccess;
