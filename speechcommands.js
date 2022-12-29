var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


// (D) COMMANDS LIST
var cmd = {
  "day" : () => {
    voice.wrap.style.backgroundColor = "yellow";
    voice.wrap.style.color = "black";
  },
 
  "night" : () => {
    voice.wrap.style.backgroundColor = "black";
    voice.wrap.style.color = "white";
  },
 
  "challonge" : () => {
    alert("Hello World!");
  }
};

// event = keyup or keydown
document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    voice.start()
  }
})
document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    voice.stop()
  }
})

var voice = {
  // (A) INIT VOICE COMMAND
  wrap : null, // HTML DEMO <DIV> WRAPPER
  btn : null, // HTML DEMO BUTTON
  
  recog : null, // SPEECH RECOGNITION OBJECT
  init : () => {
    // (A1) GET HTML ELEMENTS
    voice.wrap = document.createElement("div");
    voice.btn = document.createElement("button");
 
    // (A2) GET MIC ACCESS PERMISSION
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      // (A3) SPEECH RECOGNITION OBJECT & SETTINGS
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      voice.recog = new SpeechRecognition();
      voice.recog.lang = "en-US";
      voice.recog.continuous = false;
      voice.recog.interimResults = false;
 
      // (A4) ON SPEECH RECOGNITION - RUN CORRESPONDING COMMAND
      voice.recog.onresult = (evt) => {
        let said = evt.results[0][0].transcript.toLowerCase();
        SourceManager.load(said);
        //if (cmd[said]) { cmd[said](); }
        else { said += " (command not found)"; }
        voice.wrap.innerHTML = said;
        voice.stop();
      };
 
      // (A5) ON SPEECH RECOGNITION ERROR
      voice.recog.onerror = (err) => { console.error(evt); };
 
      // (A6) READY!
      voice.btn.disabled = false;
      voice.stop();
    })
    .catch((err) => {
      console.error(err);
      voice.wrap.innerHTML = "Please enable access and attach a microphone.";
    });
  },
 
  // (B) START SPEECH RECOGNITION
  start : () => {
    voice.recog.start();
    voice.btn.onclick = voice.stop;
    voice.btn.value = "Speak Now Or Click Again To Cancel";
  },
 
  // (C) STOP/CANCEL SPEECH RECOGNITION
  stop : () => {
    voice.recog.stop();
    voice.btn.onclick = voice.start;
    voice.btn.value = "Press To Speak";
  }
};
window.addEventListener("DOMContentLoaded", voice.init);
