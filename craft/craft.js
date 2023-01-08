let stage = function(target){
	// enable draggables to be dropped into this
	interact(target).dropzone({
	  // only accept elements matching this CSS selector
	  accept: '.craft',
	  // Require a 75% element overlap for a drop to be possible
	  overlap: 0.75,

	  // listen for drop related events:
	  ondropactivate: function (event) {
	    // add active dropzone feedback
	    event.target.classList.add('active')
	  },
	  ondragenter: function (event) {
	    var draggableElement = event.relatedTarget
	    var dropzoneElement = event.target

	    // feedback the possibility of a drop
	    dropzoneElement.classList.add('targeted')
	    draggableElement.classList.add('can-drop')
	  },
	  ondragleave: function (event) {
	    // remove the drop feedback style
	    event.target.classList.remove('targeted')
	    event.relatedTarget.classList.remove('can-drop')
	  },
	  ondrop: function (event) {
	    // attach the zone with the view
	    var elem = event.relatedTarget
	    var video = elem.getElementByTag('video')
	    var zone = event.target
	    let associated = craft.instances[zone.dataset.craft]
	    associated.free()
	    
	    
	    let id = elem.id
	    let opts = JSON.parse(localStorage.getItem(zone.id+"."+id))||{}
	    opts = Object.assign(JSON.parse(zone.dataset.defaultOpts)||{},opts)
	    let zDems = zone.getBoundingClientRect()
	    elem.left=zDems.left
	    elem.top=zDems.top
	    elem.width=zDems.width
	    elem.height=zDems.height

	    elem.classList.add('animate-transition') 
	    video.classList.add('animate-transition')
	    
	    
	    if((video.width||video.videoWidth)>(video.height||video.videoHeight)){
		video.style.width=zDems.width
	    }else{
		video.style.height=zDems.height
	    }
	
	    //associate them
	    zone.dataset.craft=zone.id
	    craft.dataset.zone=craft.id

	  },
	  ondropdeactivate: function (event) {
	    // remove active dropzone feedback
	    event.target.classList.remove('active')
	    event.target.classList.remove('target')
	  }
	})
}


let animationFrameId=0
window.addEventListener('resize', function() {
    cancelAnimationFrame(animationFrameId)
    window.requestAnimationFrame(function() {
        Object.keys(craft.instances).forEach(function(key){
		let craft = craft.instances[key]
		craft.reflow()
	})
    });
}, true);


//to gesture move the inside use "options.panMedia"
//that option is buggy though so its optional

//if you are adding a video add the video after the video.loadeddata or video.loadedmetadata event
// whichever makes sure you can ge the video.videoWidth variable
let gappingOnSide=function(elem1,elem2){
  let rect1=elem1.getBoundingClientRect()
  let rect2=elem2.getBoundingClientRect()
  let notCovering=''
  //let dems={}
  
  if(rect1.left < rect2.left){
    notCovering+='left'
    //dems.x=rect1.left
  }
  if(rect1.right > rect2.right){
    notCovering+='right'
  } 
  if(rect1.bottom > rect2.bottom){
    notCovering+='bottom'
  }
  if(rect1.top < rect2.top){
    notCovering+='top'
    //dems.y=rec1.dataset.y
  }
  
  console.log('need to fix=',notCovering)
  return notCovering
}

let craft = function(target,options){
  options = Object.assign({panMedia:false},options||{})
  target.classList.add('events-none')
  target.classList.add('craft')
  let editMode=false

  let initGestDist=0
  
  let editDebounceId=null;
  let resetDebounce=5000
  let resetDebounceCustom
  let actions=0
  let startFn=function(event) {
    actions++
    clearTimeout(editDebounceId)
  }
  let endFn=function(event) {
    actions--
    if(actions==1){
	//TODO future optimization. Only check for collision at the end of the move
	// then calculate difference to move the elemet to proper position
	//gappingOnSide(target,mediaElem)

	editDebounceId = setTimeout(endEditMode, resetDebounceCustom || resetDebounce)
    }
  }
  let endEditMode=function(){
    resetDebounceCustom=0 
    clearTimeout(editDebounceId)
      editMode=false
      target.dataset.editmode=false
      target.classList.remove('edit-mode')
      target.classList.add('animate-transition') 
      mediaElem.classList.add('animate-transition')
    }
  let startEditMode=function(inital){
    resetDebounceCustom=inital
    editMode=true
    target.dataset.editmode=true
    target.classList.add('edit-mode')
    target.classList.remove('animate-transition') 
    mediaElem.classList.remove('animate-transition')
    let updateGhost=function () {
		if(!editMode){return}
		let box = mediaElem.getBoundingClientRect()
		let style = videoGhost.style
		style.left=(box.left)+'px'
		style.top=(box.top)+'px'
		style.width=(box.width || mediaElem.videoWidth || 20)+'px'
		style.height=(box.height || mediaElem.videoHeight || 20)+'px';
		
		return setTimeout(function() {
			requestAnimationFrame(updateGhost)
		}, 1)
	}
    updateGhost()
  }
  let dragMoveFn=function (target,x,y) {
          // translate the element
          target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

          // update the posiion attributes
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        }
  let handles={/*tl:'circle',br:'circle',tr:'corner',bl:'corner',*/
	       mr:'circle',ml:'circle',mt:'circle',mb:'circle',
	       mc:'cross','transition-indicator':'cross'}
  
  let videoGhost=document.createElement('div')
  videoGhost.className='video-ghost'
  document.body.insertBefore(videoGhost,target)
  

 let mediaPos;
 let lastSafe;
  let init = function(){
      mediaPos=Object.assign({angle:0,scale:0},mediaElem.getBoundingClientRect())
      lastSafe=Object.assign({},mediaPos)
      let aspectRatio=(mediaElem.videoWidth||mediaPos.width) / (mediaElem.videoHeight||mediaPos.height)
  
  
    //add handles
    Object.keys(handles).forEach(function(key){
      let elem = document.createElement('div')
      elem.className='handle ' +((key||'').trim()+' '+(handles[key]||'').trim()).trim()
      //elem.textContent="&nbsp;";
      target.appendChild(elem) //.insertBefore(elem,target.firstChild)
      handles[key]=elem;
    })
    
    let interactable = interact(target).pointerEvents({
    holdDuration: 5000,
    }) .styleCursor(false)

//         .resizable({
//         edges: { left: handles.tl,
//                 right: handles.br,
//                 bottom: handles.br,
//                 top: handles.tl
// 	       },

//         listeners: {
//           start:startFn,
//           move (event) {
//             if(!editMode){
//               return
//             }
//             var x = (parseFloat(target.getAttribute('data-x')) || 0)
//             var y = (parseFloat(target.getAttribute('data-y')) || 0)

//             // translate when resizing from top or left edges
//             x += event.deltaRect.left
//             y += event.deltaRect.top


//             // update the element's style
//             target.style.width = event.rect.width + 'px'
//             target.style.height = event.rect.height + 'px'

//             target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

//             target.setAttribute('data-x', x)
//             target.setAttribute('data-y', y)

//           },end:endFn
//         },
//         modifiers: [
// 		interact.modifiers.aspectRatio({
// 			// make sure the width is always double the height
// 			ratio: aspectRatio,
// 			// also restrict the size by nesting another modifier
// 		modifiers: [
// 			// keep the edges inside the parent
// 			interact.modifiers.restrictEdges({
// 			outer: mediaElem
// 			}),
// 			//interact.modifiers.restrictSize({ max: 'parent' }),
// 			// keep the edges inside the parent
// 			interact.modifiers.restrictEdges({
// 				outer: 'parent'
// 			}),
// 			interact.modifiers.restrictSize({
// 				min: { width: 50, height: 50 }
// 			})
// 		    ],
// 		}),
//         ],
//         inertia: false
//       })

        .resizable({
        edges: { left: handles.ml,
                right: handles.mr,
                bottom: handles.mb,
                top: handles.mt
	       },

        listeners: {
          start:startFn,
          move (event) {
            if(!editMode){
              return
            }
            var x = (parseFloat(target.getAttribute('data-x')) || 0)
            var y = (parseFloat(target.getAttribute('data-y')) || 0)

            // translate when resizing from top or left edges
            x += event.deltaRect.left
            y += event.deltaRect.top


            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'

            target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)

          },end:endFn
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: mediaElem
          }),

          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 100, height: 50 },
           // max: mediaElem
          }),
	  interact.modifiers.restrictEdges({
            outer: 'parent',
          })
		
        ],
        inertia: false
      })

      .draggable({
        listeners: {
          start:startFn,
          move: function(event){
            if(!editMode){
              return
            }
            // keep the dragged position in the data-x/data-y attributes
            let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
            let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
            dragMoveFn(target,x,y)
          },
          end:endFn
    },
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
          })
        ]
      })
      .on('tap', function (event) {

        console.log('move to secondary',event)
      })
      .on('doubletap', function (event) {
        if(!editMode){return}
        console.log('trigger lockin',event)
      })
      .on('hold', function (event) {
      startEditMode()
      }).gesturable({
  //         modifiers: [
  //           interact.modifiers.restrictRect({
  //             restriction: mediaElem
  //           })
  //         ],
        listeners: {
          start:function(event){
            let box = mediaElem.getBoundingClientRect()
            mediaPos.width=box.width || mediaElem.videoWidth || 0
            mediaPos.height=box.height || mediaElem.videoHeight || 0
            initGestDist=event.distance
          startFn()
          },
          move (event) {
            if(!editMode){
              return
            }
            let style = mediaElem.style
            //let angleDelta = currentAngle-event.angle
            //let vector = angleDelta
            //let vector = event.scale*currentScale
            //currentScale=vector
            let initGestDelta=event.distance-initGestDist
            console.log(mediaPos.width,initGestDist-event.distance,style.height)
            //let vector = (Math.abs(event.dy)>Math.abs(event.dx))?event.dy:event.dx;
            let isGap=''
            if(style.height=="auto" || style.height=='' || style.height==null || parseFloat(style.height<=0 )){
              style.width=mediaPos.width+initGestDelta+'px'
               isGap+=gappingOnSide(target,mediaElem)
            }else{
              style.height=mediaPos.height+initGestDelta+'px'
               isGap+=gappingOnSide(target,mediaElem)
            }
              // keep the dragged position in the data-x/data-y attributes
            if(options.panMedia){
              let x = (parseFloat(mediaElem.getAttribute('data-x')) || 0) + event.dx
              let y = (parseFloat(mediaElem.getAttribute('data-y')) || 0) + event.dy
              dragMoveFn(mediaElem,x,y)
            }
            isGap+=gappingOnSide(target,mediaElem)
            if(!isGap){
              lastSafe=Object.assign(lastSafe,mediaElem.getBoundingClientRect())
            }
              //interactable.reflow({ name: 'drag', axis: 'xy' })
              target.style.width=window.innerWidth
              target.style.height=window.innerHeight
              // start a drag action
              interactable.reflow({
                name: 'resize',
                edges: { right: true, bottom: true,},
              })
          },
          end:function(){
  //           let style = mediaElem.style
  //           style.width = lastSafe.width
  //           style.height = lastSafe.height
  //           dragMoveFn(mediaElem,lastSafe.x,lastSafe.y)
              // start a resize action and wait for inertia to finish
		interactable.reflow({
			name: 'resize',
			edges: { left: true, top: true,},
		      })
            endFn()
          }
        }
    })
    startEditMode(120000)
    craft.instances[target.id]={
	free:function(){
		let zone = target.dataset.zone
	    	if(zone && zone.dataset.craft && zone.dataset.craft==target.id){
			//free them
			alert('requested to free a craft from a zone/stage')
		
		}
	},
	edit:function(){
		alert('edit on craft public interface not implmeneted')
	},
	reflow:function(){
		let zone = target.dataset.zone
	    	if(zone && zone.dataset.craft && zone.dataset.craft==target.id ){
			//free them
			alert('craft reflow needs fleshed out')
		
		}		
		
	}
    }
  }
  
  
  let mediaElem=target.querySelector('video')
  if(mediaElem){
    if(!mediaElem.videoWidth || mediaElem.videoWidth==null){
      mediaElem.addEventListener( "loadedmetadata", function (e) {
        init()
      })
    }else{
      init()
    }
  }else{
      mediaElem=target.querySelector('img,canvas')
      init()
  }
}
craft.instances={}

//document.querySelectorAll('.craft').forEach(craftIt)



