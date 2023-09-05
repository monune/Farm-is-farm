const fs = require("fs");

// import google api
const textToSpeech = require("@google-cloud/text-to-speech");

// ID
const projectId = "plated-valor-393815";
const client = new textToSpeech.TextToSpeechClient({ projectId });

// define
const tts = async (word) => {
  const text = word;
  const request = {
    input: { text: text },
    voice: {
      languageCode: "ko_KR",
      ssmlGender: "FEMALE",
      name: "ko-KR-Wavenet-A",
    },
    audioConfig: { audioEncoding: "MP3" },
  };

  // Text-to-Speech request
  client.synthesizeSpeech(request, (err, response) => {
    if (err) {
      console.error("ERROR:", err);
      return;
    }
    fs.writeFile(text + ".mp3", response.audioContent, "binary", (err) => {
      if (err) {
        console.error("ERROR:", err);
        return;
      }
      console.log(text);
    });
  });
};

// tts 기능 함수화
tts("textToSpeech");