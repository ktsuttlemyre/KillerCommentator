ajax=function(href,callback,fail){
	var r = new XMLHttpRequest();
	r.open("get", href, true);
	r.onreadystatechange = function () {
	if(r.readyState == 4) {
		if (r.status > 299){
			console.error('Server Error: ' + r.statusText + ' when callig resource '+href);
			fail && fail(r.responseText,r);
		}else if(r.status == 200){
			callback && callback(r.responseText,r);
		}else{
			console.warn('Server warning: ' + r.statusText + ' when callig resource '+href);
			fail && fail(r.responseText,r);
		}
	}};
	r.send();
}
domParse=function(html){
	let wrapper= document.createElement('div');
	wrapper.innerHTML = html
	return wrapper.firstChild
}

appendTo=function(parent,tag){
    if(typeof parent == 'string'){
	parent = document.getElementsByTagName(parent)[0]
    }
    parent.insertBefore(tag, parent.firstChild);
}

prependTo=function(parent,tag){
    if(typeof parent == 'string'){
	parent = document.getElementsByTagName(parent)[0]
    }
    parent.appendChild(tag)
}

let inject=(function(d){return function(t,src,callback){
    //simplistic way to check if we have already injected this tag
    //we protect ourselves from this function but not from native tags
    let id=btoa((typeof src == 'string')?src:JSON.stringify(src)).replace(/\=/g,'') //trim off '=' chars
    //crunch down to minimum of 32 characters
    let l = Math.floor(id.length/32) 
    id=id.split('').filter((k,i) => !(i % l)).join('')
    if (d.getElementById(id)){ return; }
    let js = d.createElement(t);
    js.id = id;
    Object.keys(src).forEach(function(key){
      js.setAttribute(key,src[key])
    })
    return js;
  }
})(document)
