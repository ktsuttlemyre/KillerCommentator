// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name default.js
// ==/ClosureCompiler==

(function(d, s, id, cb){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)){ eval('KillerCommentator.'+prompt('send a kc command')); return 0 }
    js = d.createElement(s);
    if(cb){js.onload = cb;};
    js.src = "https://ktsuttlemyre.github.io/KillerCommentator/killer-commentator.js";
    d.getElementsByTagName('head')[0].appendChild(js);
})(document, 'script', 'killer-commentator',_ => console.log('loaded kc'));
