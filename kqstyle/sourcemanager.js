window.SourceManager=(function(document,SourceManager,pp){let inject=pp.inject, appendTo=pp.appendTo, prependTo=pp.prependTo, ajax=pp.ajax, domParse=pp.domParse;
	let config={
		urls:{
			challonge:['HCC_2022'],
		},
		twitch:{video:'1686476519'}
	}

	appendTo('head',inject('link',{href:KillerCommentator.base_site+"kqstyle/sourcemanager.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"})) 

	generateId=function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
	})};

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
				SourceManager.twitchPlayer = new Twitch.Player("stage_main", options);
				//twitchPlayer.setVolume(0.5);
			}))
		},
	}
							  
	!window.api && (window.api={});				  
	!window.api.stages && (window.api.stages={
		'stage_main':{
			top:'0px',
			left:'0px',
			width:'1280px',
			height:'720px',
			className:'',
			secondary:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
		'stage_fullscreen':{
			top:'0px',
			left:'0px',
			width:'100%',
			height:'100%',
			className:'',
		},
		'stage_cam_team_blue':{
			top:'587px',
			left:'140px',
			width:'426px',
			height:'240px',
			className:'',
			secondary:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
		'stage_cam_team_gold':{
			top:'586px',
			left:'934px',
			width:'426px',
			height:'240px',
			className:'',
			secondary:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
		'stage_advert':{
			top:'5px',
			left:'1180px',
			width:'217px',
			height:'100px',
			className:'',
			secondary:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
		'stage_cam_commentator':{
			top:'125px',
			left:'1180px',
			width:'217px',
			height:'100px',
			className:'',
			secondary:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
		'stage_roster_blue':{
			top:'287px',
			left:'1180px',
			width:'217px',
			height:'100px',
			className:'',
			secondary:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
		'stage_roster_gold':{
			top:'418px',
			left:'1180px',
			width:'217px',
			height:'100px',
			className:'',
			secondary:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
		'stage_chat':{
			top:'587px',
			left:'1181px',
			width:'217px',
			height:'100px',
			className:'',
			secondary:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
	});
							  
	SourceManager.stages={}
	SourceManager.stagesData={}
				

	
	initStages=function(){
		//takeawy srollbars cause fuck those!
		document.body.style.overflow="hidden"
		
	    let id="kqstyle-viewport"
	    let kqstyle_viewport=document.getElementById(id)
	    if(!kqstyle_viewport){
		kqstyle_viewport=document.createElement('div');
		document.body.appendChild(kqstyle_viewport)
		kqstyle_viewport.id=id

		let s=kqstyle_viewport.style
		s.position='absolute'
		s.background="red"
		s.opacity="50%"
		s.border=s.padding="0"
	    }

	    let id2="kqstyle-viewport-body"
	    let inner=document.getElementById(id2)
	    if(!inner){
		inner=document.createElement('div');
		kqstyle_viewport.appendChild(inner)
		inner.id=id2
		let st=inner.style
		st.position="relative"
		st.top=st.bottom=st.left=st.right="0"
		st.width=st.height='100%'
		st.padding=st.margin='0'
	    }
		

		//attach all the stages to the kqstyle-viewport-body
		let stageParser=function(entry){
			const [id, obj] = entry;
			let stage = document.createElement('div');
			stage.id=id;
			stage.style.position='absolute'
			Object.keys(obj).forEach(function(key){
				//filter out secondary
				if(key == 'secondary'){return}
				stage.style[key]=obj[key]
			})
			stage.className+=' kc-stage'

			appendTo(inner,stage)
			SourceManager.stages[id]=stage;
			obj.elem=stage
			SourceManager.stagesData[id]=obj

			if(obj.secondary){
				stageParser([`${id}_secondary`,obj.secondary])
			}
		}
		Object.entries(window.api.stages).forEach(stageParser)

		//resize all stages with the window resize action
		window.addEventListener('resize',function(){
		    let kqStyleHeight=1080
		    let kqStyleWidth=1920

			var ctxWidth    = window.innerWidth,
			    ctxHeight   = window.innerHeight;
			var imgWidth    = kqStyleWidth,
			    imgHeight   = kqStyleHeight;
			var ratioWidth  = imgWidth  / ctxWidth,
			    ratioHeight = imgHeight / ctxHeight,
			    ratioAspect = Math.max(ratioWidth,ratioHeight);
			var newWidth    = imgWidth / ratioHeight,
			    newHeight   = imgHeight / ratioHeight;
			 var offsetX     = (ctxWidth /2 ) - (newWidth/2 ),
			    offsetY     = (ctxHeight /2) - (newHeight /2);

			kqstyle_viewport.style.width=newWidth+"px"
			kqstyle_viewport.style.height=newHeight+"px"
			kqstyle_viewport.style.top=0 //oY*yAspect+"px"
			kqstyle_viewport.style.left=offsetX+"px"


			Object.entries(SourceManager.stagesData).forEach(function(entry){
				const [id, data] = entry;
				let elem=data.elem;

			    var newWidth    = data.width / ratioHeight,
				newHeight   = data.height / ratioHeight;
			    var offsetX     = data.top / ratioHeight,
				offsetY     = data.left / ratioHeight;
				
			    let style=elem.style;
			    style.width=newWidth+"px"
			    style.height=newHeight+"px"
			    style.top=offsetY+"px"
			    style.left=offsetX+"px"
			})

			
		//alert(`${canvas1.width} ${canvas1.height} ${aspect}`)
		})
		window.dispatchEvent(new Event('resize'));
	}
							  
	SourceManager.load=function(source,stage,player){
		if(!source){return}
		player=player||SourceManager.players.iframe;
		stage=stage||SourceManager.stages.stage_main;
		
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
			return SourceManager.load(SourceManager.sources.urls.whiteboard,SourceManager.stages.stage_main,SourceManager.players.iframe);	
			case "twitch":
			return SourceManager.load(config.twitch,SourceManager.stages.stage_main,SourceManager.players.twitch);
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
	SourceManager.discoverComponents=function(){
		let createDOMSizer=function(container,child,width,height){
			let aspectRatio = width/height;
			function snapVideoToContainer(x,y,w,h){
				console.log('resizing video');
				(w!=null) && (child.style.width=`${w}px`);
				(h!=null) && (child.style.height=`${h}px`);
				(x!=null) && (child.style.transform = `translate(${x}px, ${y}px)`);
			}
			
			interact(container)
			  .resizable({
			    // resize from all edges and corners
			    edges: { left: true, right: true, bottom: true, top: true },

			    listeners: {
			      move (event) {
				var target = event.target
				var x = (Math.floor(parseFloat(target.getAttribute('data-x'))) || 0)
				var y = (Math.floor(parseFloat(target.getAttribute('data-y'))) || 0)

				// update the element's style
				let w = Math.floor(event.rect.width)
				let h = Math.floor(event.rect.height)
				target.style.width=`${w}px`;
				target.style.height=`${h}px`;
				      
				// translate when resizing from top or left edges
				x += event.deltaRect.left
				y += event.deltaRect.top

				target.style.transform = `translate(${x}px, ${y}px)`

				target.setAttribute('data-x', x)
				target.setAttribute('data-y', y)
				      
				snapVideoToContainer(x,y,w,h)
			      }
			    },
			    modifiers: [
				interact.modifiers.aspectRatio({
					// make sure the width is always double the height
					ratio: aspectRatio,
					// also restrict the size by nesting another modifier
				modifiers: [
					//interact.modifiers.restrictSize({ max: 'parent' }),
					// keep the edges inside the parent
					interact.modifiers.restrictEdges({
						outer: 'parent'
					}),

					// minimum size
					interact.modifiers.restrictSize({
						min: { width: width/10, height: height/10 }
					})
					],
				}),
			    ],
			    inertia: true
			  })
			  .draggable({
			    listeners: { move: function(event){
				  var target = event.target
				  // keep the dragged position in the data-x/data-y attributes
				  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
				  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

				  // translate the element
				  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

				  // update the posiion attributes
				  target.setAttribute('data-x', x)
				  target.setAttribute('data-y', y)
				  snapVideoToContainer(x,y)
			} },
			    inertia: true,
			    modifiers: [
			      interact.modifiers.restrictRect({
				restriction: 'parent',
				endOnly: true
			      })
			    ]
			  })
			}

		let handleMediaQuery=async function(list){
			for(var i=0,l=list.length;i<l;i++){
				let item=list[i]
				console.log(item)
				if(item.kind!='videoinput'){
					continue
				}
				
				let stream = null;
				try{
					stream = await navigator.mediaDevices.getUserMedia({
					  video: {
						width: {
							ideal: 1920,
							max: 2560,
						},
						height: {
							ideal: 1080,
							max: 1440
						},
						deviceId: {
							exact:  item.deviceId
						}
					  }
					});
				}catch(e){console.error(e)}
				if(!stream){continue}
				
				let div = document.createElement('div')
				div.className='resize-drag'
				let id = generateId()
				div.id=id
				let button = document.createElement('a')
				button.innerHTML='<i class="fa-regular fa-circle-play"></i>'
				var video = document.createElement('video');
				video.className='resize-drag-video'
				video.addEventListener( "loadedmetadata", function (e) {
					createDOMSizer(div,this,this.videoWidth,this.videoHeight)
				}, false )
				
				button.onclick=function(){video.play();button.parentNode.removeChild(button)}
				prependTo(document.body,video)
				prependTo(div,button)
				prependTo(document.body,div);
				
				
				video.srcObject = stream
				//video.autoplay=true
				video.playsinline=true
				
				let promise = video.play();
				if (promise !== undefined) {
				    promise.then(_ => {
					// Autoplay started!
					button.parentNode.removeChild(button)
				    }).catch(error => {
					// Autoplay was prevented.
					// Show a "Play" button so that user can start playback.

				    });
				}
			}
		}
		
		navigator.mediaDevices.enumerateDevices().then(handleMediaQuery,console.error)

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


	}


	//init
	appendTo(document.body,inject('script',{src:"https://unpkg.com/@ungap/custom-elements-builtin"},function(){
		appendTo(document.body,inject('script',{src:"https://unpkg.com/x-frame-bypass", type:"module"},function(){
			initStages()
			SourceManager.cmd("twitch")
		}));
	}));


	//add bootstrap
	appendTo('head',inject('meta',{name:"viewport", content:"width=device-width, initial-scale=1"}));
	appendTo('head',inject('link',{href:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css", rel:"stylesheet", integrity:"sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD", crossorigin:"anonymous"}))
	appendTo(document.body,inject('script',{src:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js", integrity:"sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN", crossorigin:"anonymous"},function(){
		  // remote script has loaded
	      }));
	ajax(KillerCommentator.base_site+"templates/video_source_modal.tmpl",function(data){
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



	return SourceManager
})(document,{},plugin_platform());
