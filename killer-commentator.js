//Console for mobile devices
;(function () {
    var src = '//cdn.jsdelivr.net/npm/eruda';
    if (!/console=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = src;    
	document.head.appendChild(script);
	script = document.createElement("script");
	script.innerHTML = ''+
		'var initErula = setInterval(function(){'+
		'	if(window.eruda){'+
		'		eruda.init();'+
		'		clearInterval(initErula)'+
		'	}'+
		'},1)'
	
	document.head.appendChild(script);
})();

window.KillerCommentator=(function(document,KillerCommentator,pp){let inject, appendTo, prependTo, ajax, domParse;
	var base_site=KillerCommentator.base_site="https://ktsuttlemyre.github.io/KillerCommentator/"
	//https://github.com/EvanHahn/ScriptInclude
	var include=KillerCommentator.include=function(){function g(){var a=this.readyState;if(!a||/ded|te/.test(a))b--,!b&&e&&f()}var a=arguments,c=document,b=a.length,f=a[b-1],e=f.call;e&&b--;for(var d=0;d<b;d++)a=c.createElement("script"),a.src=arguments[d],a.async=!0,a.onload=a.onerror=a.onreadystatechange=g,(c.head||c.getElementsByTagName("head")[0]).appendChild(a)};
	
	let callArgs = ["https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"]
	if(!pp){
		callArgs.push("https://ktsuttlemyre.github.io/KillerCommentator/plugin_platform.js")
	}
	callArgs.push(function(){
		pp = plugin_platform();
		inject=pp.inject, appendTo=pp.appendTo, prependTo=pp.prependTo, ajax=pp.ajax, domParse=pp.domParse;
		//platform plugin ready to use
		include("https://cdn.jsdelivr.net/npm/interactjs@1.10.17/dist/interact.min.js",
			"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
			base_site+"svgscribble.js",
			base_site+"rogue-audio.js",
			base_site+"kqstyle/sourcemanager.js",
			base_site+"craft/craft.js",
			base_site+"speechcommands.js",function(){
			//add scribble toolbar
			ajax(base_site+"toolbar.html",function(html){
				KillerCommentator.drawingBar = domParse(html)
				
				//add logo and activate
				ajax(base_site+"logo/index.html",function(html){
					let logo=domParse(html);
					prependTo(document.body,logo);
					
					//add carosule
					ajax(KillerCommentator.base_site+"carousel_partners.html",function(html){
						let dom=domParse(html);
						
						//source manager
						appendTo(document.body,inject('script',{src:"https://unpkg.com/@ungap/custom-elements-builtin"},function(){
							appendTo(document.body,inject('script',{src:"https://unpkg.com/x-frame-bypass", type:"module"},function(){
								if(!SourceManager.config){
									alert('no config')
									return
								}
								main()
								craft(document.createElement('div'),dom,'stage_advert',{constrainMedia:'height',noFrame:true,title:'Partners'});
								const carousel = new bootstrap.Carousel('#carousel_partners', {wrap:true,pause:false,keyboard:false,touch:false,interval:60000})
// 								let nextSlide=function(){
// 									carousel.
// 									setTimeout(nextSlide,60000)
// 								}
// 								nextSlide()
							}));
						}));

					});
					
				});
			});
		})
		


		
		
		//add bootstrap
		appendTo('head',inject('meta',{name:"viewport", content:"width=device-width, initial-scale=1"}));
		appendTo('head',inject('link',{href:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css", rel:"stylesheet", integrity:"sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD", crossorigin:"anonymous"}))

		//inject fontawesome
		//appendTo(document.body,inject('script',{src:"https://kit.fontawesome.com/48764efa36.js", crossorigin:"anonymous"},function(){}));
		appendTo('head',inject('link',{href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"}))
		//inject logo
		appendTo('head',inject('link',{href:base_site+"logo/index.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"})) 
		appendTo('head',inject('link',{href:base_site+"craft/craft.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"}))

	});

	//this is the call for entry point where we set up base envrionment
	include.apply(include,callArgs);
	 
	function selectColor(number,alpha) {
		const hue = number * 137.508; // use golden angle approximation
		if(alpha){
			return `hsl(${hue},50%,75%,${alpha})`
		}
		return `hsl(${hue},50%,75%)`;
	}						  
	KillerCommentator.debug=function(type){
		document.body.className+=' debug'
		if(!type || type == 'stage'){
			let kqstyle = document.getElementById('kqstyle-viewport')
			kqstyle.style.background=`rgba(255,255,255,.5)`
			kqstyle.style.opacity="50%"
			let entries = Object.entries(craftZone.instances)
			entries.forEach(function(entry,index){
				const [id, instance] = entry;
				let elem=instance.elem;
				if(id.startsWith('stage_fullscreen')){return}
				elem.style.background=selectColor(index,.5)
				if(instance.secondary){
					elem = instance.secondary.elem
					elem.style.background=selectColor(index,.5)
					elem.innerHTML="secondary"
				}
			})
		}
		
	}
	
	
// 	const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
// 	gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
// 	console.log(pixels); // Uint8Array

// 	function isTransparent(ctx, x, y) { // x, y coordinate of pixel
// 		// returns true if pixel is fully transparent
// 	    return ctx.getImageData(x, y, 1, 1).data[3] === 0; // 4th byte is alpha
// 	}
//	!(function(){ //attach to canvas to get events
// 		let canvas = document.getElementById('unity-canvas') || document.getElementsByTagName('canvas')[0]
// 		if(!canvas){return}
// 		var ctx;
// 		//'2d,webgl,webgl2,experimental-webgl,bitmaprenderer'.split(',')
// 		['webgl2'].forEach(function(c){
// 			if(ctx){return}
// 			ctx=canvas.getContext(c)
// 		})
		
// 		let gameStarted=false
// 		setInterval(function(){
// 			if(ctx && isTransparent(ctx,100,100)!=gameStarted){
// 				if(gameStarted){
// 					//game was started now its off
// 					console.log('stats screen showing')
// 				}else{
// 					//game was off now started
// 					console.log('game started')
// 				}
// 				gameStarted=!gameStarted
// 			}
// 		},7500)
// 	})()

 const isVideoPlaying = video => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);								  
	let main = function(){
		window.scroll(0,0) //in case you somehow scroll away
		
		SourceManager.initStages()
		//SourceManager.cmd("twitch")
		SourceManager.load(SourceManager.config.chat,'stage_chat',SourceManager.players.iframe,{resizeMode:'resize',title:'Chat',ride:true,style:{background:'#0d1117'}})
		SourceManager.discoverComponents()
		
		//add speech commands 
		interact('.killer-commentator')
		  .on('tap', function (event) {
		    event.preventDefault()
		    let cssClass='listening'
		    event.currentTarget.classList.add(cssClass)
		    voice.start(function(){event.currentTarget.classList.remove(cssClass)})
		  })
		  .on('doubletap', function (event) {
		    event.preventDefault()
		    let cssClass='searching'
		    event.currentTarget.classList.toggle(cssClass)
		    SourceManager.discoverComponents(function(){event.currentTarget.classList.remove(cssClass)});
		  })
		  .on('hold', function (event) {
		    event.currentTarget.classList.add('rotate')
		    setTimeout(function(){event.currentTarget.classList.remove('rotate')},10000)
		    var kcWindow = window.open("","Killer Commentator Control Panel")
		    if(kcWindow){
			    ajax(base_site+"controlpanel/index.html",function(html){
				appendTo(kcWindow.document.body,domParse(html))
				kcWindow.initControlPanel()
			    })
			    var html = `<html><head><script src="${base_site}controlpanel/controlpanel.js"></script></head><body></body></html>`

			    kcWindow.document.open()
			    kcWindow.document.write(html)
			    kcWindow.document.close()
		    }else{
			    alert('Please allow popups')
		    }
		  })
		  .draggable({
		    // enable inertial throwing
		    inertia: true,
		    // keep the element within the area of it's parent
		    modifiers: [
		      interact.modifiers.restrictRect({
			restriction: 'parent',
			endOnly: true
		      })
		    ],
		    // enable autoScroll
		    autoScroll: false,

		    listeners: {
		      // call this function on every dragmove event
		      move: dragMoveListener,
		      start (event) {
		        console.log(event.type, event.target)
			SVGScribble.hide()
			SVGScribble.clear()
		      },
		      // call this function on every dragend event
		      end (event) {
			SVGScribble.show()
		      }
		    }
		  })

		function dragMoveListener (event) {
		  var target = event.target
		  // keep the dragged position in the data-x/data-y attributes
		  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
		  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

		  // translate the element
		  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

		  // update the posiion attributes
		  target.setAttribute('data-x', x)
		  target.setAttribute('data-y', y)
		}

		// this function is used later in the resizing and gesture demos
		window.dragMoveListener = dragMoveListener
	}
	
	//force background videos play
	let forcePlay=function(){
		document.querySelectorAll('video[autoplay][loop][muted]').forEach(function(vid){
			if(isVideoPlaying(vid)){return}
			vid.play()
		})
	}
	setInterval(forcePlay,5000)
	setTimeout(forcePlay,1)
	
	return KillerCommentator
})(document,{},(window.plugin_platform && window.plugin_platform()));
