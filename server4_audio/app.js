try {

    const express = require("express");
    const cors = require("cors");

    const createFolderController = require("./controllers/createFolder-controller");
    const TTSController = require("./controllers/TTS-controller");
    const playAudioController = require("./controllers/playAudio-controller");
    const deleteController = require("./controllers/delete-controller");

    const server = express();

    server.use(express.json()); // It parses incoming JSON requests and puts the parsed data in request.body.
    server.use(cors());

    server.use("/api/createFolder", createFolderController);
    server.use("/api/textToSpeech", TTSController); // Text To Speech
    server.use("/api/playAudio", playAudioController);
    server.use("/api/delete", deleteController);

    server.use("*", (request, response) => {
        response.status(404).send("Route Not Found");
    })

    // Type to run: node app / npm start
    server.listen(3004, () => console.log("=========== server4_audio. Listening on http://localhost:3004 ==========="));

    // Request to convert text to audio.
    // http://localhost:3005/api/TextToSpeech
    // POST
    // {
    //     "text": "8",
    //     "language": "en-US",
    //     "voice": "en-US-JennyNeural",
    //     "rate": "-100.00%",
    //     "fileName": "1"
    // }

    // Request to receive audio.
    // http://localhost:3005/api/playAudio/1/36w.wav
    // GET

}
catch (err) {
    console.log(err);
}