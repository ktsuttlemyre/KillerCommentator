include=function(){function g(){var a=this.readyState;if(!a||/ded|te/.test(a))b--,!b&&e&&f()}var a=arguments,c=document,b=a.length,f=a[b-1],e=f.call;e&&b--;for(var d=0;d<b;d++)a=c.createElement("script"),a.src=arguments[d],a.async=!0,a.onload=a.onerror=a.onreadystatechange=g,(c.head||c.getElementsByTagName("head")[0]).appendChild(a)};
include("https://ktsuttlemyre.github.io/KillerCommentator/plugin_platform.js",function(){
	//platform plguin ready to use
	include("https://cdn.jsdelivr.net/npm/interactjs@1.10.17/dist/interact.min.js","svgscribble.js","/kqstyle/sourcemanager.js","speechcommands.js",function(){
		//add logo and activate
		ajax("logo/index.html",function(html){
			appendTo(document.body,domParse(html));
			//add speech commands  
		});
		
		//add scribble toolbar
		ajax("toolbar.html",function(html){
			appendTo(document.body,domParse(html))
			SVGScribble.init();
			SVGScribble.toggle();
		});
	})

	//inject fontawesome
	//appendTo(document.body,inject('script',{src:"https://kit.fontawesome.com/48764efa36.js", crossorigin:"anonymous"},function(){}));
	appendTo('head',inject('link',{href:"	https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"}))
	//inject logo
	appendTo('head',inject('link',{href:"logo/index.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"})) 
});
 
