
SourceManager={}
SourceManager.sources={
	urls:{
		rawhoney:"https://rawhoney.neonexus.co/strategy/whiteboard",
		kqwhiteboard:"https://kqwhiteboard.surge.sh"
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
	}
}
SourceManager.stages={
	mediaStage:document.getElementById('media_stage');
}
SourceManager._load=function(source,stage,player){
	player=player||SourceManager.players.iframe;
	stage=stage||SourceManager.stages.mediaStage;
	
	stage.innerHTML = "";

	let domElem=player(source);
        domElem && stage.appendChild(player);
	return 
}
SourceManager.load=function(source){
	switch(source){
		case "twitch":
		return SourceManager._load({video:'1686476519'},SourceManager.stages.mediaStage,SourceManager.player.twitch);
		default:
			//is it a whiteboard?
			source = (SourceManager.sources.whiteboard[source] && SourceManager.sources.whiteboard[source].src) || source
		return SourceManager._load(SourceManager.sources.url[source]||source)
	}
}

SourceManager.loadComponents=function(options){


	//add bootstrap
	appendTo('head',inject('meta',{name:"viewport", content:"width=device-width, initial-scale=1"}));
	appendTo('head',inject('link',{href:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css", rel:"stylesheet", integrity:"sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD", crossorigin:"anonymous"}))
	appendTo(document.body,inject('script',{src:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js", integrity:"sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN", crossorigin:"anonymous"},function(){
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
				appendTo(modal,item)
			})
		},console.error)


		appendTo(document.body,node)
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
}

SourceManager.load("twitch"))
