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
			"https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js",
			base_site+"svgscribble.js",
			base_site+"kqstyle/sourcemanager.js",
			base_site+"speechcommands.js",function(){
			//add logo and activate
			//add scribble toolbar
			ajax(base_site+"toolbar.html",function(html){
				appendTo(document.body,domParse(html))
				startScribble()
				ajax(base_site+"logo/index.html",function(html){
					let logo=domParse(html);
					prependTo(document.body,logo);
					main()
				});
			});
		})

		//inject fontawesome
		//appendTo(document.body,inject('script',{src:"https://kit.fontawesome.com/48764efa36.js", crossorigin:"anonymous"},function(){}));
		appendTo('head',inject('link',{href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"}))
		//inject logo
		appendTo('head',inject('link',{href:base_site+"logo/index.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"})) 
	});

	//this is the call for entry point where we set up base envrionment
	include.apply(include,callArgs);
	 
	let startScribble=function(){
		SVGScribble.init();
		SVGScribble.toggle();
	}

	function selectColor(number,alpha) {
		const hue = number * 137.508; // use golden angle approximation
		if(alpha){
			return `hsl(${hue},50%,75%,${alpha})`
		}
		return `hsl(${hue},50%,75%)`;
	}						  
	KillerCommentator.debug=function(type){
		if(!type || type == 'stage'){
			let kqstyle = document.getElementById('kqstyle-viewport')
			kqstyle.style.background=`rgba(255,255,255,.5)`
			kqstyle.style.opacity="50%"
			let entries = Object.entries(SourceManager.stagesData)
			entries.forEach(function(entry,index){
				const [id, data] = entry;
				let elem=data.elem;
				if(id.startsWith('stage_fullscreen')){return}
				elem.style.background=selectColor(index,.5)
				if(data.secondary){
					elem = document.getElementById(id+"_secondary")
					elem.style.background=selectColor(index,.5)
					elem.innerHTML="secondary"
				}
			})
		}
		
	}


	let main = function(){
		//add speech commands 
		interact('.killer-commentator')
		  .on('tap', function (event) {
		    event.preventDefault()
		    event.currentTarget.classList.add('listening')
		    voice.start()
		  })
		  .on('doubletap', function (event) {
		    event.preventDefault()
		    event.currentTarget.classList.toggle('deleting')
		    setTimeout(function(){event.currentTarget.classList.remove('deleting')},10000)
		  })
		  .on('hold', function (event) {
	// 			    event.currentTarget.classList.toggle('rotate')
	// 			    event.currentTarget.classList.remove('large')
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
		    autoScroll: true,

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
	return KillerCommentator
})(document,{},(window.plugin_platform && window.plugin_platform()));
