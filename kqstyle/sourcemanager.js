window.SourceManager=(function(document,SourceManager,pp){let inject=pp.inject, appendTo=pp.appendTo, prependTo=pp.prependTo, ajax=pp.ajax, domParse=pp.domParse;
	let config=null
		try{
			config=JSON.parse(localStorage.getItem('KillerCommentator.config'))
		}catch(e){
			alert('error parsing config')
		}
	if(!config){
		//config=SourceManager.config=showOpenFilePicker()
		//localStorage.setItem('KillerCommentator.config',config)
		alert('using default config')
		
		config={
    "urls": {
        "challonge": [
            "HCC_2022"
        ]
    },
    "twitch": {
        "video": "1686476519",
        "channel": "kqsfl"
    },
    "backgrounds": {
        "stage_main": {
            "player": "backgroundVideo",
            "source": "https://kqsfl.com/wp-content/uploads/2023/01/hotline_background.mp4"
        }
    },
    "chat": "https://nightdev.com/hosted/obschat/?theme=dark&channel=kqsfl&fade=false&bot_activity=false",
    "liveOnLocation": {
        "guest": "",
        "scene": "https://vdo.ninja/?view=PRubKX4&solo&room=liveonlocation1",
        "host": "https://vdo.ninja/?push=PRubKX4_hostlink&view=PRubKX4&ssid&room=liveonlocation1&quality=1&bitrate=500"
    }
}
		//config=SourceManager.config=showOpenFilePicker()
		//localStorage.setItem('KillerCommentator.config',JSON.stringify(config))

	}
SourceManager.config=config
	
let placeholders=[
"https://kqsfl.com/wp-content/uploads/2022/11/DALL·E-2022-11-15-18.50.30-A-synthwave-miami-vice-style-digital-art-of-a-futuristic-female-warrior-in-golden-cybernetic-bee-themed-armor-with-vibrant-neon-colors.png",
"https://kqsfl.com/wp-content/uploads/2022/11/DALL·E-2022-11-15-18.50.49-A-synthwave-miami-vice-style-digital-art-of-a-futuristic-female-warrior-in-golden-cybernetic-bee-themed-armor-with-vibrant-neon-colors.png",
"https://kqsfl.com/wp-content/uploads/2022/11/DALL·E-2022-11-15-18.51.06-A-synthwave-hotline-miami-style-digital-art-of-a-futuristic-female-warrior-in-golden-cybernetic-bee-themed-armor-with-vibrant-neon-colors.png",
"https://kqsfl.com/wp-content/uploads/2022/11/DALL·E-2022-11-15-18.51.11-A-synthwave-hotline-miami-style-digital-art-of-a-futuristic-female-warrior-in-golden-cybernetic-bee-themed-armor-with-vibrant-neon-colors.png",
"https://kqsfl.com/wp-content/uploads/2022/11/DALL·E-2022-11-15-18.51.17-A-synthwave-stylized-digital-art-of-a-futuristic-female-warrior-in-golden-cybernetic-bee-themed-armor-with-vibrant-neon-colors.png",
"https://kqsfl.com/wp-content/uploads/2022/11/DALL·E-2022-11-15-18.51.22-A-synthwave-hotline-miami-style-digital-art-of-a-futuristic-female-warrior-in-golden-cybernetic-bee-themed-armor-with-vibrant-neon-colors.png",
"https://kqsfl.com/wp-content/uploads/2022/11/DALL·E-2022-11-15-18.51.26-A-synthwave-style-digital-art-of-a-futuristic-female-warrior-in-golden-cybernetic-bee-themed-armor-with-vibrant-neon-colors.png",
"https://kqsfl.com/wp-content/uploads/2022/11/DALL·E-2022-11-15-18.51.30-A-synthwave-style-digital-art-of-a-futuristic-female-warrior-in-golden-cybernetic-bee-themed-armor-with-vibrant-neon-colors.png",
"https://kqsfl.com/wp-content/uploads/2022/11/DALL·E-2022-11-15-18.51.41-A-synthwave-style-digital-art-of-a-futuristic-female-warrior-in-golden-cybernetic-bee-themed-armor-with-vibrant-neon-colors.png",
"https://kqsfl.com/wp-content/uploads/2022/11/DALL·E-2022-11-15-18.51.45-A-synthwave-style-digital-art-of-a-futuristic-female-warrior-in-golden-cybernetic-bee-themed-armor-with-vibrant-neon-colors.png"
]

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
let placeholderPool=[];
function getPlaceholder(){
	if(!placeholderPool.length){
		placeholderPool=shuffleArray(placeholders.slice());
	}
	return placeholderPool.pop()
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
			},
			chat:function(channel){
				channel=channel || (config.twitch && config.twitch.channel)
				return `https://www.twitch.tv/${channel}/chat?popout=`
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
		img:function(src,style){
			let div = document.createElement('div')
			let st = div.style
			st.overflow='hidden'
			st.width='100%';
			st.height='100%'
			st.display='flex';
			st.flexFlow='row nowrap';
			st.alignItems='center';
			st.justifyContent='center';
			
			Object.entries(style||{}).forEach(function(entry){
				const [key,value]=entry
				if(key=='img'){return}
				st[key]=value
			})
			
			let img = new Image();
			img.referrerpolicy="no-referrer"
			img.onload=function(){
				if(this.width >= this.height){
					this.style.height='auto';
					this.style.width='100%'
				}else{
					this.style.height='100%';
					this.style.width='auto'
				}
				img.style.position='absolute'
				img.style.top='0px'
				Object.entries(style?style.img:{}).forEach(function(entry){
					const [key,value]=entry
					this.style[key]=value
				})
			}
			img.src = src
			div.appendChild(img)
			return div;
		},
		iframe:function(src){
			var ifrm = document.createElement("iframe");
			ifrm.setAttribute("src", src);
			ifrm.scrolling="auto"
			ifrm.setAttribute("is","x-frame-bypass") //https://github.com/niutech/x-frame-bypass
			ifrm.allowtransparency="true"
			ifrm.style.width = "100%";
			ifrm.style.height = "100%";
			ifrm.frameBorder = "0";
			return ifrm;
		},
		twitch:function(craft, options){
			options=Object.assign({
				width: "100%",
				height: "100%",
				// only needed if your site is also embedded on embed.example.com and othersite.example.com
				parent: [location.host,"kq.style","ktsuttlemyre.github.io"]
				},options)
			let cb = function(){
				SourceManager.twitchPlayer = new Twitch.Player(craft.id||craft, options);
				//twitchPlayer.setVolume(0.5);
			}
			let script=inject('script',{src:"https://player.twitch.tv/js/embed/v1.js"},cb)
			if(!script){
				//duplicate script
				cb && setTimeout(cb,1)
			}else{
				appendTo(document.body,script)
			}
			

			
			
			return div
		},
		backgroundVideo:function(source){
			return SourceManager.players.video({
					attributes:{
						//poster:'',
						preload:'preload',
						playsinline:'playsinline',
						src:source,
						type:"video/mp4",
						autoplay:'autoplay',
						muted:'muted',
						loop:'loop',
					},
					listeners:{
						oncanplay:function(event){
							event.target.play()
						}
					}
				})
		
		},
		video:function(options){
			var vdo = document.createElement("video");
			
			['attributes',"style",'listeners'].forEach(function(iter){
				Object.entries(options[iter]||{}).forEach(function(entry){
					const [key,value] = entry
					if(iter=='attributes'){
						vdo.setAttribute(key, value)
					}else if(iter=='style'){
						vdo.style[key]=value
					}else if(iter=='listeners'){
						vdo.addEventListener(key, value, false)

					}
					
				})
			})
			vdo.style.width = "100%";
			vdo.style.height = "100%";
			
			return vdo;
		},
		element:function(options){
			
		}
		
	}
							  
	!window.api && (window.api={});				  
	!window.api.zones && (window.api.zones=[
// 		{
// 			id:'stage_fullscreen',
// 			top:'0px',
// 			left:'0px',
// 			width:'100%',
// 			height:'100%',
// 			className:'',
// 		},
		{
			id:'stage_main',
			top:'0px',
			left:'0px',
			width:'1540px',
			height:'874px',
			className:'',
			enhance:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
			secondary:[
			],
			tertiary:[
			]
		},
		{
			id:'stage_cam_team_blue',
			top:'881px',
			left:'5px',
			width:'348px',
			height:'193px',
			className:'',
			enhance:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
		{
			id:'stage_cam_team_gold',
			top:'881px',
			left:'1208px',
			width:'348px',
			height:'193px',
			className:'',
			enhance:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
		{
			id:'stage_advert',
			top:'0px',
			left:'1579px',
			width:'335px',
			height:'181px',
			className:'',
			enahnce:{
				top:'5px',
				left:'1245px',
				width:'670px',
				height:'360px',
				className:'',
			},
		},
		{ //aspect ratio 1.86111111111
			id:'stage_cam_commentator',
			top:'205px',
			left:'1579px',
			width:'335px',
			height:'181px',
			className:'',
			enhance:{
				top:'5px',
				left:'1245px',
				width:'670px',
				height:'360px',
				className:'',
			},
		},
		{
			id:'stage_roster_blue',
			top:'440px',
			left:'1579px',
			width:'335px',
			height:'185px',
			className:'',
			enhance:{
				top:'0px',
				left:'910px',
				width:'670px',
				height:'360px',
				className:'',
			},
		},
		{
			id:'stage_roster_gold',
			top:'637px',
			left:'1579px',
			width:'335px',
			height:'185px',
			className:'',
			enhance:{
				top:'0px',
				left:'910px',
				width:'670px',
				height:'360px',
				className:'',
			},
		},
		{
			id:'stage_chat',
			top:'875px',
			left:'1579px',
			width:'335px',
			height:'200px',
			className:'',
			enhance:{
				top:'380px',
				left:'1575px',
				width:'335px',
				height:'702px',
				className:'',
			},
		},
	]);

				
	SourceManager.resize=function(event){
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


		Object.entries(craftZone.instances).forEach(function(entry){
			const [id, instance] = entry;
			let elem=instance.elem;
			let data = instance.unscaledGeometry;
			if(id=="stage_fullscreen"){return}

		    var newWidth    = parseFloat(data.width) / ratioHeight,
			newHeight   = parseFloat(data.height) / ratioHeight;
		    var offsetX     = parseFloat(data.left) / ratioHeight,
			offsetY     = parseFloat(data.top) / ratioHeight;

		    let style=elem.style;
		    style.width=newWidth+"px"
		    style.height=newHeight+"px"
		    style.top=offsetY+"px"
		    style.left=offsetX+"px"
			
	            if(instance.snapOn){
			    instance.snap(true)
		    }
		})
		
		Object.entries(craft.instances).forEach(function(entry){
			const [key, instance] = entry;
			if(!instance.assZone){return}
			let geo=instance.getGeometry()
			instance.resizeTo(geo)
		})
	}
	let kqstyle_viewport;
	SourceManager.initStages=function(){
		//takeawy srollbars cause fuck those!
		document.body.style.overflow="hidden"
		
	    let id="kqstyle-viewport"
	    kqstyle_viewport=document.getElementById(id)
	    if(!kqstyle_viewport){
		kqstyle_viewport=document.createElement('div');
		document.body.appendChild(kqstyle_viewport)
		kqstyle_viewport.id=id

		let s=kqstyle_viewport.style
		s.position='absolute'
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
		let stageParser=function(style){
			//add craft logic
			let id=style.id
			delete style.id 
			var zone = craftZone(id,style)
			zone.elem.className='kc-zone'
			zone.elem.dataset['unscaledgeometry']=JSON.stringify(style)
			appendTo(inner,zone.elem)
			
			if(zone.enhance){
				zone.enhance.elem.className='kc-zone'
				appendTo(inner,zone.enhance.elem)
			}
		}
		window.api.zones.reverse().forEach(stageParser)
		
		Object.entries(craftZone.instances).forEach(function(entry){
			const [id, zone] = entry;
			if(id.match(/advert|chat|comment/ig)){return}
			if(id.match(/roster_blue/ig)){
				(zone.elem||zone).classList.add('frame','blue');
			}
			if(id.match(/roster_gold/ig)){
				(zone.elem||zone).classList.add('frame','gold');
			}
			const background = getPlaceholder()
			if(!zone.isPrimary){
				return
			}
			SourceManager.attach(background,zone,SourceManager.players['img'])
		})
		
		//add customizations
		Object.entries(config.backgrounds).forEach(function(entry){
			const [stageId,opts] = entry
			SourceManager.attach(opts.source,craftZone.instances[stageId].elem,SourceManager.players[opts.player])
		})		
		
		let resizeDebounceTimer=0;
		//resize all stages with the window resize action
		window.addEventListener('resize',function(){
			// If there's a timer, cancel it
			window.cancelAnimationFrame(resizeDebounceTimer);
			
		    	// Setup the new requestAnimationFrame()
			resizeDebounceTimer = window.requestAnimationFrame(function () {
				//debounced call
				SourceManager.resize()
			});
		})
		window.dispatchEvent(new Event('resize'));
	}
							  
	SourceManager.attach=function(source,stage,player){
		if(!source){return}
		player=player||SourceManager.players.iframe;
		if(stage ==null || typeof stage == 'string'){
			stage = (craftZone.instances[stage].elem || document.getElementById(stage) || craftZone.instances['stage_main'].elem)
		}else{
			stage = stage.elem || stage	
		}
		
		stage.innerHTML = "";

		if(source.call){
			source=source()
		}

		let domElem=player(source);
	        domElem && stage.appendChild(domElem);
		return 
	}
	SourceManager.load=function(source,stage,player,craftOptions,reuse){
		let craft;
		if(!source){return}
		player=player||SourceManager.players.iframe;
		stage=(stage == null || typeof stage == 'string')?(craftZone.instances[stage].elem || document.getElementById(stage) || craftZone.instances['stage_main'].elem) : stage;
		
		if(source.call){
			source=source()
		}

		let domElem=player(source);
		if(reuse){
			if(reuse.isCraft){
				craft = reuse
			}else if(typeof reuse == 'string'){
				craft=craft.instances[reuse]
			}else{
				craft = reuse
			}
			if(!craft){
				craft = document.getElementById(reuse)
			}	
		}
		if(!craft){
			craft = document.createElement('div')
			craft.id=generateId()
			
			SourceManager.autoCroppingCraft(craft,domElem,stage,craftOptions)
		}
		return 
	}
	SourceManager.cmd=function(source){
		if(!source){return}
		var tmp = source;
		switch(source){
			case "whiteboard":
			return SourceManager.load(SourceManager.sources.urls.whiteboard,craftZone.instances['stage_main'].elem,SourceManager.players.iframe);	
			case "twitch":
			return SourceManager.load(config.twitch,craftZone.instances['stage_main'].elem,SourceManager.players.twitch);
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
					
			return SourceManager.attach(source)
		}
	}
	SourceManager.discoverComponents=async function(constraints,callback){
		constraints = Object.assign({},constraints)
		if (!'mediaDevices' in navigator && !navigator.mediaDevices.getUserMedia){
			let err='this broswer doesn\'t have access to navigator.medaDevices api'
			console.error(err)
			callback && callback(null,err)
			return
		}
		
		let stream;
		try{
			stream = await navigator.mediaDevices.getUserMedia({
				video:true,
				audio:true
			});
		}catch(err){
			console.error(err)
			callback && callback(null,err)
			return
		}
		if(!stream){
			let err = 'Please accept the security prompt'
			console.error(err)
			callback && callback(null,err)
			return
		}
		
		let list;
		try{
			list = await navigator.mediaDevices.enumerateDevices();
		}catch(err){
			console.error(err)
			callback && callback(null,err)
			return
		}
		if(!list || !list.length){
			let err = 'no devices found'
			console.error(err)
			callback && callback(null,err)
			return
		}
		
		
		for(var i=0,l=list.length;i<l;i++){
			let item = list[i]
			if(item == null){continue}
			console.log('found item',item)
			
			//dont duplicate inputs
			if(document.getElementById(`device-${item.deviceId}`)){
				return
			}
			
			if(item.kind=='audioinput'){
				let group = list.find(element => element == item.groupId);
				if(group){
					return
				}
				
				
			}
			if(item.kind=='videoinput'){
				let stream = null;
				try{
					stream = await navigator.mediaDevices.getUserMedia(Object.assign({
					  video: {
						deviceId: {
							exact:  item.deviceId
						}
					  }
					},constraints));
				}catch(err){
					console.error(err)
					callback && callback(null,err)
				}
				if(!stream){continue}
				
				//find audio
				let audio = list.find(element => element == item.groupId && item.kind=='audioinput');
				let rogueAudio 
				if(audio){
					rogueAudio = RogueAudio(audio)
				}


				// quick note about archeteture design
				// stages are designate parking spaces for crafts
				// crafts have not children and crafts do not attach to stages via document.node interactions
				// the just hover over via css translation(x,y) and style.width style.height
				// craft_cropping_viewport is the viewport that will ensure video stays within stage bounds
				// video attaches to craft_cropping_viewport only and is centered via flexbox

				let div = document.createElement('div')
				let id = generateId()
				div.id=id
				div.dataset.label=item.label
				div.dataset.groupId=item.groupId
				div.dataset.kind=item.kind
				div.dataset.deviceId=item.deviceId
				let button = document.createElement('a')
				button.innerHTML='<i class="fa-regular fa-circle-play"></i>'
				var video = document.createElement('video');
				video.id = `device-${item.deviceId}`
// 				video.addEventListener( "loadedmetadata", function (event) {
// 					//SourceManager.draggableCraft(div,this,this.videoWidth/this.videoHeight)
// 					SourceManager.autoCroppingCraft(div,this,this.videoWidth/this.videoHeight)
// 				}, false )

				button.onclick=function(){video.play();button.parentNode.removeChild(button)}
				
				prependTo(div,button)
				
				SourceManager.autoCroppingCraft(div,video,undefined,undefined,true)

				video.srcObject = stream
				//video.autoplay=true
				video.playsinline=true

				let promise = video.play();
				if (promise !== undefined) {
				    promise.then(_ => {
					// Autoplay started!
					button.parentNode.removeChild(button)
				    }).catch(err => {
					// Autoplay was prevented.
					// Show a "Play" button so that user can start playback.
					console.error(err)
					callback && callback(null,err);
					return
				    });
				}
			}	
		}
	}
	
	SourceManager.autoCroppingCraft=function(container,child,stage,options,addScribble){
		
		craft(container,child,stage,options,function(win){
			if(!addScribble){return}
			let instance = SVGScribble.init(win.elem.querySelector('.craft-viewport'));
			instance.toggle();
			instance.toolbar('hide')
		})
	}
					  
	SourceManager.draggableCraft=function(container,child,aspectRatio){
			container.className='resize-drag'
			child.className='resize-drag-video'

			//let aspectRatio = width/height;
			function snapVideoToContainer(x,y,w,h){
				console.log('resizing video');
				(w!=null) && (child.style.width=`${w}px`);
				(h!=null) && (child.style.height=`${h}px`);
				(x!=null) && (child.style.transform = `translate(${x}px, ${y}px)`);
			}
			
			// minimum size
			// let factor = 50/aspectRatio //dont go smaller than 50 pixels either width or height
			// let minWidth = width/factor
			// let minHeight = height/factor
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
					interact.modifiers.restrictSize({
						min: { width: 50, height: 50 }
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


// 	ajax(KillerCommentator.base_site+"templates/video_source_modal.tmpl",function(data){
// 		data=data.split(/\r?\n---/);
// 		let modalSRC = data[0]
// 		let itemSRC = data[1]

// 		let modal=domParse(modal)
// 		let item=domParse(item)

// 		navigator.mediaDevices.enumerateDevices().then(function(devices){
// 			devices.forEach(function(device){
// 				item.innerHTML=`${deviceId}${groupId}${kind}${label}`
// 				appendTo(modal,item)
// 			})
// 		},console.error)


// 		appendTo(document.body,node)
// 	})
							  
	SourceManager.setAugment=function(map){
		switch(map){
			case day:
			break
			case night:
			break
			case dusk:
			break
			case twilight:
			break
			default:
		}
	}
	SourceManager.setLayout=function(label){
		switch(label){
			case home:
			break;
			default:
		}
	}
							  
const berriesPerMap={
	day:66,
	night:54,
	dusk:66,
	twilight:60,
}
let berries = 0
let famineTimer;
let famineEnd = function(){
	
}
window.onGameEvent=function(event){
  let values = event.values
  switch(event.event_type){
    case gamestart:
        let [map,goldOnLeft,elapsedTime,attractMode,version] = values
        map.replace('map_','')
	SourceManager.setLayout('home')
	SourceManager.setAugment(map)
	berries = berriesPerMap[map]
      break;
            
    //case: gameend:
    case victory:
      const [victor,type] = values
        SourceManager.setLayout(victor.toLowerCase())
	SourceManager.setAugment()
	clearTimeout(famineTimer)

    case berryDeposit:
      if(--berries<=0){
	//famine start
	famineTimer=setTimeout(famineEnd,90000)
      }
    break
    case berryKickIn:
      if(berries<=0){
	//famine start
	famineTimer=setTimeout(famineEnd,90000)
      }
      break
      default:
        console.debug('unhandled event',event)
  }
}


	return SourceManager
})(document,{},plugin_platform());
