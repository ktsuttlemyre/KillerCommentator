(function(d, s, id, cb){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)){ return; }
    js = d.createElement(s); js.id = id;
    js.onload = cb;
    js.src = "https://ktsuttlemyre.github.io/KillerCommentator/plugin_platform.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document, 'script', 'killer-commentator',function(){
  //inject fontawesome
  appendTo(document.body,inject('script',{src:"https://kit.fontawesome.com/48764efa36.js", crossorigin:"anonymous"},function(){}));
  //inject logo
  appendTo('head',inject('link',{href:"logo/index.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"}))
  ajax("logo/index.html",function(html){appendTo(document.body,domParse(html))});
  
  //start scribbler
  appendTo(document.body,inject('script',{src:"svgscribble.js", crossorigin:"anonymous"},function(){
	    ajax("toolbar.html",function(html){
        appendTo(document.body,domParse(html))
        SVGScribble.init();
        SVGScribble.toggle();
      });
  }));
  
  //start sourcemanager
  appendTo(document.body,inject('script',{src:"./kqstyle/sourcemanager.js", crossorigin:"anonymous"},function(){

  }));
  
  //add speech commands
  appendTo(document.body,inject('script',{src:"speechcommands.js", crossorigin:"anonymous"},function(){

  }));
  
  
}));


//             document.getElementById('init').onclick=function(){
//                 if(!SVGScribble.state){

//                 }
//                 SVGScribble && SVGScribble.toggle && SVGScribble.toggle();
//             }




