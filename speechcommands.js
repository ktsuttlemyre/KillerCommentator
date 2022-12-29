var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

//add any special cases here
let aliases = {
  bracket:'challonge',
  solange:'challonge',
}
let commands = []

//create a cmdSpace array with all possible commands we are looking for
let cmdSpaceList=Array.concat(commands,Object.keys(aliases))
Object.keys(aliases).forEach(function(key){
  cmdSpaceList.push(aliases[key])
})

//remove duplicates
cmdSpaceList = cmdSpaceList.filter(function(value, index, self) {
  return self.indexOf(value) === index;
});

//create regex to search for our cmdspace
let cmdSpaceRegex = new RegExp(cmdSpaceList.join('|'),'g')


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
  if(voice.listening){return}
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
  listening:false,
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
        voice.wrap.innerHTML = said;
        //remove any extra filler words
        said = said.match(cmdSpaceRegex)
        let alias = aliases[said]
        console.log("I heard you say: "+said,"I know an alias of: "+alias)
        SourceManager.load(alias||said);
        //if (cmd[said]) { cmd[said](); }
        //else { said += " (command not found)"; }
        voice.stop();
      };
 
      // (A5) ON SPEECH RECOGNITION ERROR
      voice.recog.onerror = (err) => { voice.stop();console.error(evt); };
 
      // (A6) READY!
      voice.btn.disabled = false;
      voice.stop();
    })
    .catch((err) => {
      console.error(err);
      voice.wrap.innerHTML = "Please enable access and attach a microphone.";
      console.log("Please enable access and attach a microphone.")
      voice.stop()
    });
  },
 
  // (B) START SPEECH RECOGNITION
  start : () => {
    voice.recog.start();
    voice.btn.onclick = voice.stop;
    voice.btn.value = "Speak Now Or Click Again To Cancel";
    voice.listening=true
    console.log('Listening, Please Speak now')
  },
 
  // (C) STOP/CANCEL SPEECH RECOGNITION
  stop : () => {
    voice.recog.stop();
    voice.btn.onclick = voice.start;
    voice.listening=false
    voice.btn.value = "Press To Speak";
  }
};
window.addEventListener("DOMContentLoaded", voice.init);
