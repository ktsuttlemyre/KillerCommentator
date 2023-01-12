window.SourceManager=(function(document,SourceManager,pp){let inject=pp.inject, appendTo=pp.appendTo, prependTo=pp.prependTo, ajax=pp.ajax, domParse=pp.domParse;
	let config={
		urls:{
			challonge:['HCC_2022'],
		},
		twitch:{
			//video:'1686476519'
			channel:'kqsfl'
		}
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
			chat:'https://nightdev.com/hosted/obschat/?theme=dark&channel=kqsfl&fade=false&bot_activity=false&prevent_clipping=false'
			
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
			ifrm.style.height = "100%";
			ifrm.frameBorder = "0";
			return ifrm;
		},
		twitch:function(options){
			options=Object.assign({
				width: "100%",
				height: "100%",
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
			secondary:{
				top:'0px',
				left:'0px',
				width:'426px',
				height:'240px',
				className:'',
			},
		},
		{
			id:'stage_cam_team_blue',
			top:'881px',
			left:'5px',
			width:'348px',
			height:'193px',
			className:'',
			secondary:{
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
			secondary:{
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
			left:'1580px',
			width:'335px',
			height:'181px',
			className:'',
			secondary:{
				top:'5px',
				left:'1245px',
				width:'670px',
				height:'360px',
				className:'',
			},
		},
		{ //aspect ratio 1.86111111111
			id:'stage_cam_commentator',
			top:'185px',
			left:'1580px',
			width:'335px',
			height:'181px',
			className:'',
			secondary:{
				top:'5px',
				left:'1245px',
				width:'670px',
				height:'360px',
				className:'',
			},
		},
		{
			id:'stage_roster_blue',
			top:'430px',
			left:'1580px',
			width:'335px',
			height:'181px',
			className:'',
			secondary:{
				top:'0px',
				left:'910px',
				width:'670px',
				height:'360px',
				className:'',
			},
		},
		{
			id:'stage_roster_gold',
			top:'630px',
			left:'1580px',
			width:'335px',
			height:'181px',
			className:'',
			secondary:{
				top:'0px',
				left:'910px',
				width:'670px',
				height:'360px',
				className:'',
			},
		},
		{
			id:'stage_chat',
			top:'881px',
			left:'1575px',
			width:'335px',
			height:'181px',
			className:'',
			secondary:{
				top:'380px',
				left:'1575px',
				width:'335px',
				height:'360px',
				className:'',
			},
		},
	]);

				
	SourceManager.resize=function(e){
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
			let data = instance.geometry;
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
		})
	}
	let kqstyle_viewport;
	let initStages=function(){
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
			appendTo(inner,zone.elem)
			
			if(zone.secondary){
				zone.secondary.elem.className='kc-zone'
				appendTo(inner,zone.secondary.elem)
			}
		}
		window.api.zones.reverse().forEach(stageParser)
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
							  
	SourceManager.load=function(source,stage,player){
		if(!source){return}
		player=player||SourceManager.players.iframe;
		stage=stage||craftZone.instances['stage_main'].elem;
		
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
					
			return SourceManager.load(source)
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
		
		let returnList=[]
		for(var i=0,l=list.length;i<l;i++){
			let item = list[i]
			console.log('found item',item)
			
			//dont duplicate inputs
			if(document.getElementById(`device-${item.deviceId}`)){
				return
			}
			returnList.push(item)
			if(item.kind=='videoinput'){
				let stream = null;
				try{
					stream = await navigator.mediaDevices.getUserMedia(Object.assign({
					  video: {
// 						width: {
// 							ideal: 1920,
// 		//							max: 2560,
// 						},
// 						height: {
// 							ideal: 1080,
// 		//							max: 1440
// 						},
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

				//quick note about archeteture design
				// stages are designate parking spaces for crafts
				// crafts have not children and crafts do not attach to stages via document.node interactions
				// the just hover over via css translation(x,y) and style.width style.height
				// craft_cropping_viewport is the viewport that will ensure video stays within stage bounds
				// video attaches to craft_cropping_viewport only and is centered via flexbox

				let div = document.createElement('div')
				let id = generateId()
				div.id=id
				let button = document.createElement('a')
				button.innerHTML='<i class="fa-regular fa-circle-play"></i>'
				var video = document.createElement('video');
				video.id = `device-${item.deviceId}`
				video.addEventListener( "loadedmetadata", function (event) {
					//SourceManager.draggableCraft(div,this,this.videoWidth/this.videoHeight)
					SourceManager.autoCroppingCraft(div,this,this.videoWidth/this.videoHeight)
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
				    }).catch(err => {
					// Autoplay was prevented.
					// Show a "Play" button so that user can start playback.
					console.error(err)
					callback && callback(null,err)

				    });
				}
			}	
		}
	}
	
	SourceManager.autoCroppingCraft=function(container,child,aspectRatio){
		container.appendChild(child)
		return craft(container,aspectRatio)
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
