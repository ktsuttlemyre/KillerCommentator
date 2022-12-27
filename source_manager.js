ajax=function(href,callback,fail){
	var r = new XMLHttpRequest();
	r.open("get", href, true);
	r.onreadystatechange = function () {
	if(r.readyState == 4) {
		if (r.status > 299){
			console.error('Server Error: ' + r.statusText + ' when callig resource '+href);
			fail && fail(r.responseText,r);
		}else if(r.status == 200){
			callback && callback(r.responseText,r);
		}else{
			console.warn('Server warning: ' + r.statusText + ' when callig resource '+href);
			fail && fail(r.responseText,r);
		}
	}};
	r.send();
}
domParse=function(html){
	let wrapper= document.createElement('div');
	wrapper.innerHTML = html
	return wrapper.firstChild
}

appendBefore=function(parent,tag){
    if(typeof parent == 'string'){
	parent = document.getElementsByTagName(parent)[0]
    }
    parent.insertBefore(tag, parent.firstChild);
}

appendAfter=function(parent,tag){
    if(typeof parent == 'string'){
	parent = document.getElementsByTagName(parent)[0]
    }
    parent.appendChild(tag)
}

let inject=(function(d){return function(t,src,callback){
    //simplistic way to check if we have already injected this tag
    //we protect ourselves from this function but not from native tags
    let id=btoa((typeof src == 'string')?src:JSON.stringify(src))
    //crunch down to minimum of 32 characters
    let l = Math.floor(id.length/32) 
    id=id.split('').filter((k,i) => !(i % l)
    if (d.getElementById(id)){ return; }
    let js = d.createElement(t);
    js.id = id;
    Object.keys(src).forEach(function(key){
      js.setAttribute(key,src[key])
    })
    return js;
  }
})(document)

//add bootstrap
appendAfter('head',inject('meta',{name:"viewport", content:"width=device-width, initial-scale=1"}));
appendAfter('head',inject('head','link',{href:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css", rel:"stylesheet", integrity:"sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD", crossorigin:"anonymous"}))
appendAfter(document.body,inject('body','script',{src:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js", integrity:"sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN", crossorigin:"anonymous"},function(){
          // remote script has loaded
      }));
ajax("https://ktsuttlemyre.github.io/vod-scribble/templates/video_source_modal.tmpl",function(data){
	data=data.split(/\r?\n---/);
	let modalSRC = data[0]
	let itemSRC = data[1]
	
	let modal=domParse(modal)
	let item=domParse(item)
	
	navigator.mediaDevices.enumerateDevices().then(function(devices){
		devices.forEach(function(device){
			item.innerHTML=`${deviceId}${groupId}${kind}${label}`
			appendAfter(modal,item)
		})
	},console.error)
	
	
	appendAfter(document.body,node)
})

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



navigator.mediaDevices.enumerateDevices().then((data) => console.log(data),console.error)

