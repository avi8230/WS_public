import urls from './Urls';

class ImageAndAudio_webAccess {

    public async getImage(userUuid: string, imageName: string): Promise<any> {
        const response = await fetch(`${urls.words.getImage}${userUuid}/${imageName}`);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    public async getAudio(userUuid: string, audioName: string): Promise<any> {
        const response = await fetch(`${urls.words.getAudio}${userUuid}/${audioName}`);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}

const imageAndAudio_webAccess = new ImageAndAudio_webAccess();

export default imageAndAudio_webAccess;