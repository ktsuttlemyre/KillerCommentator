
//add bootstrap
let inject=(function(d){return function(t,src,callback){
    //simplistic way to check if we have already injected this tag
    //we protect ourselves from this function but not from native tags
    let id=btoa((typeof src == 'string')?src:JSON.stringify(src))
    if (d.getElementById(id)){ return; }
    let js = d.createElement(t);
    js.id = id;
    Object.keys(src).forEach(function(key){
      js.setAttribute(key,src[key])
    })
    let carret = (t=='script')?'body':'head';
    d.getElementsByTagName(carret)[0].appendChild(js);
  }
})(document)
inject('script',{src:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js", integrity:"sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN", crossorigin:"anonymous"},function(){
          // remote script has loaded
      });
inject('meta',{name:"viewport", content:"width=device-width, initial-scale=1"}));
inject('link',{href:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css", rel:"stylesheet", integrity:"sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD", crossorigin:"anonymous"})


var constraints = {
  audio: true,
  video: {
    width: { ideal: 800 },
    height: { ideal: 600 }
  }
};

let game_stage = document.createElement("video", { id: "game_stage", autoplay:true, playsinline:true, width:"900px", height:"550px"});
game_stage.style.position="absolute"
game_stage.style.top=0
game_stage.style.left=0
game_stage.autoplay=true
game_stage.playsinline=true
document.body.insertBefore(game_stage, document.body.firstChild);

let cam1 = document.createElement("video", { id: "cam1", autoplay:true, playsinline:true, width:"900px", height:"550px"});
cam1.style.position="absolute"
cam1.style.bottom=0
cam1.style.left=0
cam1.autoplay=true
cam1.playsinline=true
document.body.appendChild(cam1);


function attachSourceToStream(elem){
	function handleError(error) {
	  console.log('getUserMedia error: ', error);
	}
	
	function handleSuccess(stream) {
		window.stream = stream; // only to make stream available to console
		elem.srcObject = stream;
	}
	
	navigator.mediaDevices.getUserMedia(constraints).
	  then(handleSuccess).catch(handleError);
}
attachSourceToStream(game_stage)
attachSourceToStream(cam1)


