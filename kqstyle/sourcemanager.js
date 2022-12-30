let config={
	urls:{
		challonge:['HCC_2022'],
	},
	twitch:{video:'1686476519'}
}
SourceManager={}
SourceManager.sources={
	//https://challonge.com/module/instructions
	urls:{
		rawhoney:"https://rawhoney.neonexus.co/strategy/whiteboard",
		kqwhiteboard:"https://kqwhiteboard.surge.sh",
		whiteboard:"https://docs.google.com/drawings/d/1PZrZUx18R4Xp7XG6jRjD3DCQJy2SpOD_z-bhJaIZOPk/edit?usp=sharing",
		blank:"about:blank",
		challonge:function(){
			let arg = arguments[0]||config.urls.challonge[0];
			return `https://challonge.com/${arg}/module?show_tournament_name=1&show_final_results=1&show_standings=1&show_voting=1`
		}
	},
	whiteboards: {
		kqday:{
			src:'https://kqsfl.com/wp-content/uploads/2022/09/Copy-of-Day.png',
			stamps:[
				{src:"queen_gold",x:0,y:0},{src:"queen_blue",x:0,y:0},
				{src:"drone_gold",x:0,y:0},{src:"drone_gold",x:0,y:0},
				{src:"drone_gold",x:0,y:0},{src:"drone_gold",x:0,y:0},
				{src:"drone_blue",x:0,y:0},{src:"drone_blue",x:0,y:0},
				{src:"drone_blue",x:0,y:0},{src:"drone_blue",x:0,y:0},
				{src:"snail",x:0,y:0}
			]
		},
		kqnight:{
			src:'https://kqsfl.com/wp-content/uploads/2022/09/Night.png'
		},
		kqdusk:{
			src:'https://kqsfl.com/wp-content/uploads/2022/09/Copy-of-Dusk.png'
		},
		kqmeat:{
			src:'https://kqsfl.com/wp-content/uploads/2022/09/twilight.png'
		}
	}
}
SourceManager.players={
	iframe:function(src){
		var ifrm = document.createElement("iframe");
		ifrm.setAttribute("src", src);
		ifrm.scrolling="auto"
		ifrm.setAttribute("is","x-frame-bypass") //https://github.com/niutech/x-frame-bypass
		ifrm.allowtransparency="true"
		ifrm.style.width = "100%";
		ifrm.style.height = "80%";
		ifrm.frameBorder = "0";
		return ifrm;
	},
	twitch:function(options){
		options=Object.assign({
			width: "100%",
			height: "80%",
			// only needed if your site is also embedded on embed.example.com and othersite.example.com
			parent: [location.host,"kq.style","ktsuttlemyre.github.io"]
			},options)
		appendTo(document.body,inject('script',{src:"https://player.twitch.tv/js/embed/v1.js"},function(){
			SourceManager.twitchPlayer = new Twitch.Player("media_stage", options);
			//twitchPlayer.setVolume(0.5);
		}))
	},
}
SourceManager.stages={
	mediaStage:document.getElementById('media_stage')
}
SourceManager.load=function(source,stage,player){
	if(!source){return}
	player=player||SourceManager.players.iframe;
	stage=stage||SourceManager.stages.mediaStage;
	
	stage.innerHTML = "";

	if(source.call){
		source=source()
	}

	let domElem=player(source);
        domElem && stage.appendChild(domElem);
	return 
}
SourceManager.cmd=function(source){
	if(!source){return}
	var tmp = source;
	switch(source){
		case "whiteboard":
		return SourceManager.load(SourceManager.sources.urls.whiteboard,SourceManager.stages.mediaStage,SourceManager.players.iframe);	
		case "twitch":
		return SourceManager.load(config.twitch,SourceManager.stages.mediaStage,SourceManager.players.twitch);
		default:
			//is it a whiteboard?
			source = (SourceManager.sources.whiteboards[source] && SourceManager.sources.whiteboards[source].src) || source
			
			if(!SourceManager.sources.urls[source]){
				let tmp = source
				if(source.indexOf('google') >=0 || source.indexOf('search') >=0){
					source='https://www.google.com/webhp?igu=1' //or http://www.google.com/custom?q=&btnG=Search
				}else if(source.indexOf('.') >= 0){
					source='https://'+source
				}
				//TODO recognize google, bing, yahoo and other websites as websites
				//else if(source ){
				//source is in https://github.com/Kikobeats/top-sites/blob/master/top-sites.json
				//	source='http://'+source
				//}
				if(source===tmp){
					return 1
				}
			}else{
				source = SourceManager.sources.urls[source]
			}
				
		return SourceManager.load(source)
	}
}

SourceManager.loadComponents=function(options){

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
}

//init
appendTo(document.body,inject('script',{src:"https://unpkg.com/@ungap/custom-elements-builtin"},function(){
	appendTo(document.body,inject('script',{src:"https://unpkg.com/x-frame-bypass", type:"module"},function(){
		SourceManager.cmd("twitch")
	}));
}));


//add bootstrap
appendTo('head',inject('meta',{name:"viewport", content:"width=device-width, initial-scale=1"}));
appendTo('head',inject('link',{href:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css", rel:"stylesheet", integrity:"sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD", crossorigin:"anonymous"}))
appendTo(document.body,inject('script',{src:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js", integrity:"sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN", crossorigin:"anonymous"},function(){
	  // remote script has loaded
      }));
ajax("https://ktsuttlemyre.github.io/KillerCommentator/templates/video_source_modal.tmpl",function(data){
	data=data.split(/\r?\n---/);
	let modalSRC = data[0]
	let itemSRC = data[1]

	let modal=domParse(modal)
	let item=domParse(item)

	navigator.mediaDevices.enumerateDevices().then(function(devices){
		devices.forEach(function(device){
			item.innerHTML=`${deviceId}${groupId}${kind}${label}`
			appendTo(modal,item)
		})
	},console.error)


	appendTo(document.body,node)
})

//force the iframe to lose focus anytime we get an oppertunity 
setInterval(_ => {
    if (document.activeElement.tagName == "IFRAME") {
        document.activeElement.blur();
	document.body.focus();
    }
}, 500);
