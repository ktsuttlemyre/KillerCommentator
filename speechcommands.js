//based off the code
// https://code-boxx.com/voice-commands-javascript-speech-recognition/
let initSpeechCommands=function(){
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
  var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

  //add any special cases here
  let aliases = {
    challonge:'bracket,solange,challenge,standings,lunch',
    whiteboard:'white boy,white,write,writeboard,write board',
    groups:'pool,pools,group',
    twitch:'live,cab,feed,stream',
    standings:'standing',
    youtube:'replay',
    roster:'teamsheet,teams'
  }
  let commands = []

  //create a cmdSpace array with all possible commands we are looking for
  let cmdSpaceList=commands.concat(Object.keys(aliases))
  let aliasSpace={}
  Object.keys(aliases).forEach(function(key){
    //fix aliases strings to arrays
    if(aliases[key].split){
      aliases[key]=aliases[key].split(/\s*,\s*/);
    }
    cmdSpaceList=cmdSpaceList.concat(aliases[key])
    aliases[key].forEach(function(al){aliasSpace[al]=key})
  })

  //remove duplicates
  cmdSpaceList = cmdSpaceList.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });

  //create regex to search for our cmdspace
  let cmdSpaceRegex = new RegExp(cmdSpaceList.join('|'),'g')

  //if we are using a stopWord as a command then remove it from the stopwords list
  stopWords.stopWords = stopWords.stopWords.filter(function(item) {
    return cmdSpaceList.indexOf(item.id) !== -1;
  });
  let stopWordsRegex=new RegExp('\\b('+stopWords.stopWords.join('|')+')\\b', 'g')
  

  // event = keyup or keydown
  let isSpaceDown;
  document.addEventListener('keydown', event => {
    if(isSpaceDown){return}
    if (event.code === 'Space') {
      isSpaceDown=true;
      voice.start()
    }
  })
  document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
      isSpaceDown=false;
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
        voice.recog.interimResults = true;

        // (A4) ON SPEECH RECOGNITION - RUN CORRESPONDING COMMAND
        voice.recog.onresult = (evt) => {
          // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
          // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
          // It has a getter so it can be accessed like an array
          // The first [0] returns the SpeechRecognitionResult at position 0.
          // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects
          // that contain individual results.
          // These also have getters so they can be accessed like arrays.
          // The second [0] returns the SpeechRecognitionAlternative at position 0.
          // We then return the transcript property of the SpeechRecognitionAlternative object
          let said = evt.results[0][0].transcript.toLowerCase();
          console.log('all possible responses I heard you say',evt.results)
          voice.wrap.innerHTML = said;
          console.log("I heard you say: ["+said+"]")
          //remove any extra filler words
          let strongWords = said.replace(stopWordsRegex, '');
          //removing stop words leaves mutli spaces so clean those up
          //we have to do this in 2 steps because if you have a hanging ' due to stop words being removed you will get extra words that dont exact match
          // example: "let's check the challonge" turns to "checkchallonge" if you try to remove spaces as you remove words
          //this regex looks for word characters only
          console.log("I removed the stop words and have: ["+strongWords+"]");
          strongWords=strongWords.replace(/\W+\B/g,'').trim()
          console.log("After trimming up a bit I Now understand: ["+strongWords+"]")
          //see if we recognize anything
          let recognize = (strongWords.match(cmdSpaceRegex) || [])[0] || strongWords
          console.log("I recognize: ["+recognize+ "]")
          let alias = aliasSpace[recognize||said]
          alias && console.log("It has an alias of: ["+alias+"]")
          SourceManager.cmd(alias||recognize||said);
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
}

//https://github.com/dariusk/corpora/blob/master/data/words/stopwords/en.json
let stopWords = 
{
  "description": "English stop words",
  "stopWords":
    [
      "'ll",
      "'ve",
      "a",
      "a's",
      "able",
      "about",
      "above",
      "abroad",
      "abst",
      "accordance",
      "according",
      "accordingly",
      "across",
      "act",
      "actually",
      "added",
      "adj",
      "adopted",
      "affected",
      "affecting",
      "affects",
      "after",
      "afterwards",
      "again",
      "against",
      "ago",
      "ah",
      "ahead",
      "ain't",
      "all",
      "allow",
      "allows",
      "almost",
      "alone",
      "along",
      "alongside",
      "already",
      "also",
      "although",
      "always",
      "am",
      "amid",
      "amidst",
      "among",
      "amongst",
      "amoungst",
      "amount",
      "an",
      "and",
      "announce",
      "another",
      "any",
      "anybody",
      "anyhow",
      "anymore",
      "anyone",
      "anything",
      "anyway",
      "anyways",
      "anywhere",
      "apart",
      "apparently",
      "appear",
      "appreciate",
      "appropriate",
      "approximately",
      "are",
      "aren",
      "aren't",
      "arent",
      "arise",
      "around",
      "as",
      "aside",
      "ask",
      "asking",
      "associated",
      "at",
      "auth",
      "available",
      "away",
      "awfully",
      "b",
      "back",
      "backward",
      "backwards",
      "be",
      "became",
      "because",
      "become",
      "becomes",
      "becoming",
      "been",
      "before",
      "beforehand",
      "begin",
      "beginning",
      "beginnings",
      "begins",
      "behind",
      "being",
      "believe",
      "below",
      "beside",
      "besides",
      "best",
      "better",
      "between",
      "beyond",
      "bill",
      "biol",
      "both",
      "bottom",
      "brief",
      "briefly",
      "but",
      "by",
      "c",
      "c'mon",
      "c's",
      "ca",
      "call",
      "came",
      "can",
      "can't",
      "cannot",
      "cant",
      "caption",
      "cause",
      "causes",
      "certain",
      "certainly",
      "changes",
      "clearly",
//      "co",
//      "co.",
//      "com",
      "come",
      "comes",
      "computer",
      "con",
      "concerning",
      "consequently",
      "consider",
      "considering",
      "contain",
      "containing",
      "contains",
      "corresponding",
      "could",
      "couldn't",
      "couldnt",
      "course",
      "cry",
      "currently",
      "d",
      "dare",
      "daren't",
      "date",
      "de",
      "definitely",
      "describe",
      "described",
      "despite",
      "detail",
      "did",
      "didn't",
      "different",
      "directly",
      "do",
      "does",
      "doesn't",
      "doing",
      "don't",
      "done",
      "down",
      "downwards",
      "due",
      "during",
      "e",
      "each",
      "ed",
      "edu",
      "effect",
      "eg",
      "eight",
      "eighty",
      "either",
      "eleven",
      "else",
      "elsewhere",
      "empty",
      "end",
      "ending",
      "enough",
      "entirely",
      "especially",
      "et",
      "et-al",
      "etc",
      "even",
      "ever",
      "evermore",
      "every",
      "everybody",
      "everyone",
      "everything",
      "everywhere",
      "ex",
      "exactly",
      "example",
      "except",
      "f",
      "fairly",
      "far",
      "farther",
      "few",
      "fewer",
      "ff",
      "fifteen",
      "fifth",
      "fify",
      "fill",
      "find",
      "fire",
      "first",
      "five",
      "fix",
      "followed",
      "following",
      "follows",
      "for",
      "forever",
      "former",
      "formerly",
      "forth",
      "forty",
      "forward",
      "found",
      "four",
      "from",
      "front",
      "full",
      "further",
      "furthermore",
      "g",
      "gave",
      "get",
      "gets",
      "getting",
      "give",
      "given",
      "gives",
      "giving",
      "go",
      "goes",
      "going",
      "gone",
      "got",
      "gotten",
      "greetings",
      "h",
      "had",
      "hadn't",
      "half",
      "happens",
      "hardly",
      "has",
      "hasn't",
      "hasnt",
      "have",
      "haven't",
      "having",
      "he",
      "he'd",
      "he'll",
      "he's",
      "hed",
      "hello",
      "help",
      "hence",
      "her",
      "here",
      "here's",
      "hereafter",
      "hereby",
      "herein",
      "heres",
      "hereupon",
      "hers",
      "herself",
      "herse”",
      "hes",
      "hi",
      "hid",
      "him",
      "himself",
      "himse”",
      "his",
      "hither",
      "home",
      "hopefully",
      "how",
      "how's",
      "howbeit",
      "however",
      "hundred",
      "i",
      "i'd",
      "i'll",
      "i'm",
      "i've",
      "id",
      "ie",
      "if",
      "ignored",
      "im",
      "immediate",
      "immediately",
      "importance",
      "important",
      "in",
      "inasmuch",
//      "inc",
 //     "inc.",
      "indeed",
      "index",
      "indicate",
      "indicated",
      "indicates",
      "information",
      "inner",
      "inside",
      "insofar",
      "instead",
      "interest",
      "into",
      "invention",
      "inward",
      "is",
      "isn't",
      "it",
      "it'd",
      "it'll",
      "it's",
      "itd",
      "its",
      "itself",
      "itse”",
      "j",
      "just",
      "k",
      "keep",
      "keeps",
      "kept",
      "keys",
      "kg",
      "km",
      "know",
      "known",
      "knows",
      "l",
      "largely",
      "last",
      "lately",
      "later",
      "latter",
      "latterly",
      "least",
      "less",
      "lest",
      "let",
      "let's",
      "lets",
      "like",
      "liked",
      "likely",
      "likewise",
      "line",
      "little",
      "look",
      "looking",
      "looks",
      "low",
      "lower",
      "ltd",
      "m",
      "made",
      "mainly",
      "make",
      "makes",
      "many",
      "may",
      "maybe",
      "mayn't",
      "me",
      "mean",
      "means",
      "meantime",
      "meanwhile",
      "merely",
      "mg",
      "might",
      "mightn't",
      "mill",
      "million",
      "mine",
      "minus",
      "miss",
      "ml",
      "more",
      "moreover",
      "most",
      "mostly",
      "move",
      "mr",
      "mrs",
      "much",
      "mug",
      "must",
      "mustn't",
      "my",
      "myself",
      "myse”",
      "n",
      "na",
      "name",
      "namely",
      "nay",
      "nd",
      "near",
      "nearly",
      "necessarily",
      "necessary",
      "need",
      "needn't",
      "needs",
      "neither",
      "never",
      "neverf",
      "neverless",
      "nevertheless",
      "new",
      "next",
      "nine",
      "ninety",
      "no",
      "no-one",
      "nobody",
      "non",
      "none",
      "nonetheless",
      "noone",
      "nor",
      "normally",
      "nos",
      "not",
      "noted",
      "nothing",
      "notwithstanding",
      "novel",
      "now",
      "nowhere",
      "o",
      "obtain",
      "obtained",
      "obviously",
      "of",
      "off",
      "often",
      "oh",
      "ok",
      "okay",
      "old",
      "omitted",
      "on",
      "once",
      "one",
      "one's",
      "ones",
      "only",
      "onto",
      "opposite",
      "or",
      "ord",
      "other",
      "others",
      "otherwise",
      "ought",
      "oughtn't",
      "our",
      "ours",
      "ours ",
      "ourselves",
      "out",
      "outside",
      "over",
      "overall",
      "owing",
      "own",
      "p",
      "page",
      "pages",
      "part",
      "particular",
      "particularly",
      "past",
      "per",
      "perhaps",
      "placed",
      "please",
      "plus",
      "poorly",
      "possible",
      "possibly",
      "potentially",
      "pp",
      "predominantly",
      "present",
      "presumably",
      "previously",
      "primarily",
      "probably",
      "promptly",
      "proud",
      "provided",
      "provides",
      "put",
      "q",
      "que",
      "quickly",
      "quite",
      "qv",
      "r",
      "ran",
      "rather",
      "rd",
      "re",
      "readily",
      "really",
      "reasonably",
      "recent",
      "recently",
      "ref",
      "refs",
      "regarding",
      "regardless",
      "regards",
      "related",
      "relatively",
      "research",
      "respectively",
      "resulted",
      "resulting",
      "results",
      "right",
      "round",
      "run",
      "s",
      "said",
      "same",
      "saw",
      "say",
      "saying",
      "says",
      "sec",
      "second",
      "secondly",
      "section",
      "see",
      "seeing",
      "seem",
      "seemed",
      "seeming",
      "seems",
      "seen",
      "self",
      "selves",
      "sensible",
      "sent",
      "serious",
      "seriously",
      "seven",
      "several",
      "shall",
      "shan't",
      "she",
      "she'd",
      "she'll",
      "she's",
      "shed",
      "shes",
      "should",
      "shouldn't",
      "show",
      "showed",
      "shown",
      "showns",
      "shows",
      "side",
      "significant",
      "significantly",
      "similar",
      "similarly",
      "since",
      "sincere",
      "six",
      "sixty",
      "slightly",
      "so",
      "some",
      "somebody",
      "someday",
      "somehow",
      "someone",
      "somethan",
      "something",
      "sometime",
      "sometimes",
      "somewhat",
      "somewhere",
      "soon",
      "sorry",
      "specifically",
      "specified",
      "specify",
      "specifying",
      "state",
      "states",
      "still",
      "stop",
      "strongly",
      "sub",
      "substantially",
      "successfully",
      "such",
      "sufficiently",
      "suggest",
      "sup",
      "sure",
      "system",
      "t",
      "t's",
      "take",
      "taken",
      "taking",
      "tell",
      "ten",
      "tends",
      "th",
      "than",
      "thank",
      "thanks",
      "thanx",
      "that",
      "that'll",
      "that's",
      "that've",
      "thats",
      "the",
      "their",
      "theirs",
      "them",
      "themselves",
      "then",
      "thence",
      "there",
      "there'd",
      "there'll",
      "there're",
      "there's",
      "there've",
      "thereafter",
      "thereby",
      "thered",
      "therefore",
      "therein",
      "thereof",
      "therere",
      "theres",
      "thereto",
      "thereupon",
      "these",
      "they",
      "they'd",
      "they'll",
      "they're",
      "they've",
      "theyd",
      "theyre",
      "thick",
      "thin",
      "thing",
      "things",
      "think",
      "third",
      "thirty",
      "this",
      "thorough",
      "thoroughly",
      "those",
      "thou",
      "though",
      "thoughh",
      "thousand",
      "three",
      "throug",
      "through",
      "throughout",
      "thru",
      "thus",
      "til",
      "till",
      "tip",
      "to",
      "together",
      "too",
      "took",
      "top",
      "toward",
      "towards",
      "tried",
      "tries",
      "truly",
      "try",
      "trying",
      "ts",
      "twelve",
      "twenty",
      "twice",
      "two",
      "u",
      "un",
      "under",
      "underneath",
      "undoing",
      "unfortunately",
      "unless",
      "unlike",
      "unlikely",
      "until",
      "unto",
      "up",
      "upon",
      "ups",
      "upwards",
      "us",
      "use",
      "used",
      "useful",
      "usefully",
      "usefulness",
      "uses",
      "using",
      "usually",
      "uucp",
      "v",
      "value",
      "various",
      "versus",
      "very",
      "via",
      "viz",
      "vol",
      "vols",
      "vs",
      "w",
      "want",
      "wants",
      "was",
      "wasn't",
      "way",
      "we",
      "we'd",
      "we'll",
      "we're",
      "we've",
      "wed",
      "welcome",
      "well",
      "went",
      "were",
      "weren't",
      "what",
      "what'll",
      "what's",
      "what've",
      "whatever",
      "whats",
      "when",
      "when's",
      "whence",
      "whenever",
      "where",
      "where's",
      "whereafter",
      "whereas",
      "whereby",
      "wherein",
      "wheres",
      "whereupon",
      "wherever",
      "whether",
      "which",
      "whichever",
      "while",
      "whilst",
      "whim",
      "whither",
      "who",
      "who'd",
      "who'll",
      "who's",
      "whod",
      "whoever",
      "whole",
      "whom",
      "whomever",
      "whos",
      "whose",
      "why",
      "why's",
      "widely",
      "will",
      "willing",
      "wish",
      "with",
      "within",
      "without",
      "won't",
      "wonder",
      "words",
      "world",
      "would",
      "wouldn't",
      "www",
      "x",
      "y",
      "yes",
      "yet",
      "you",
      "you'd",
      "you'll",
      "you're",
      "you've",
      "youd",
      "your",
      "youre",
      "yours",
      "yourself",
      "yourselves",
      "z",
      "zero"
    ]
}
initSpeechCommands();
