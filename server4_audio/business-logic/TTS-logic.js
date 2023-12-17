const sdk = require("microsoft-cognitiveservices-speech-sdk");
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);

function textToSpeechAsync(text) {
    return new Promise((resolve, reject) => {

        const audioConfig = sdk.AudioConfig.fromAudioFileOutput(`../../ws_assets/audio/${text.folderName}/${text.fileName}`);
        let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

        let ssml;
        if (text.highQuality > 0) {
            ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${text.language}">`;
            ssml += `<voice name="${text.voice}">`;
            ssml += `<prosody rate="-100.00%">`;
            ssml += `${text.text}`;
            ssml += `</prosody>`;
            ssml += `</voice>`;
            ssml += `</speak>`;
        }
        else {
            ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${text.language}">`;
            ssml += `<voice name="${text.voice}">`;
            ssml += `${text.text}`;
            ssml += `</voice>`;
            ssml += `</speak>`;
        }

        synthesizer.speakSsmlAsync(

            ssml,

            function (result) {

                // Conversion completed successfully.
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    resolve(result.reason);
                }

                // Conversion started but aborted.
                else {
                    resolve(result.errorDetails);
                }

                synthesizer.close();
                synthesizer = null;

            },

            // The conversion didn't start at all, because of an error on Microsoft's server.
            function (err) {
                reject(err);

                synthesizer.close();
                synthesizer = null;
            }

        );
    });
};

module.exports = {
    textToSpeechAsync
}