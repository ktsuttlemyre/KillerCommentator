// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name default.js
// ==/ClosureCompiler==
if(window.obsstudio){ //if it is a browser source in obs use this
  (function(d, s, id, cb){
      var js, fjs = d.getElementsByTagName(s)[0];
      js = d.createElement(s); js.id=id;
      if(cb){js.onload = cb;};
      js.src = "https://ktsuttlemyre.github.io/KillerCommentator/obs-event-driven.js";
      d.getElementsByTagName('head')[0].appendChild(js);
  })(document, 'script', 'obs-event-driven',_ => console.log('loaded kc'));
}else{
  (function(d, s, id, cb){ //if it is a browser proper use this
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)){ eval('KillerCommentator.'+prompt('send a kc command')); return 0 }
      js = d.createElement(s); js.id=id;
      if(cb){js.onload = cb;};
      js.src = "https://ktsuttlemyre.github.io/KillerCommentator/killer-commentator.js";
      d.getElementsByTagName('head')[0].appendChild(js);
  })(document, 'script', 'killer-commentator',_ => console.log('loaded kc'));
}
