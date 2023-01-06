
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

let craft = function(target){
  target.classList.add('events-none')
  target.classList.add('craft')
  let debounceId;
  let resetDebounce=5000
  let editMode=false

  let initGestDist=0
  let mediaElem=target.querySelector('video,img')
  let targetPos={}
  let mediaPos={x:0,y:0,width:0,height:0,angle:0,scale:0}
                        //x:0,
                        //y:0,
                        //width:mediaElem.style.width||mediaElem.videoWidth,
                        //height:mediaElem.style.height||mediaElem.videoHeight
                       //}
  
  
  
  let startFn=function(event) {
    clearTimeout(debounceId)
  }
  let endFn=function(event) {
    //TODO future optimization. Only check for collision at the end of the move
    // then calculate difference to move the elemet to proper position
    //gappingOnSide(target,mediaElem)
    
    debounceId = setTimeout(endEditMode, resetDebounce)
  }
  let endEditMode=function(){
    clearTimeout(debounceId)
      editMode=false
      target.classList.remove('edit-mode')
    }
  let startEditMode=function(){
    editMode=true
    target.classList.add('edit-mode')
  }
  let dragMoveFn=function (target,dx,dy,force) {
          if(!force){
            if(!editMode){
            return
          }}

          // keep the dragged position in the data-x/data-y attributes
          var x = (parseFloat(target.getAttribute('data-x')) || 0) + dx
          var y = (parseFloat(target.getAttribute('data-y')) || 0) + dy

          // translate the element
          target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

          // update the posiion attributes
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        }
  interact(target).pointerEvents({
  holdDuration: 5000,
  })
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },

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
          outer: 'parent'
        }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 }
        })
      ],

      inertia: true
    })
    .draggable({
      listeners: {
        start:startFn,
        move: function(event){dragMoveFn(target,event.dx,event.dy)},
        end:endFn
  },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
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
    if(editMode==true){
      clearTimeout(debounceId)
      return
    }
  startEditMode()
    }).gesturable({
//         modifiers: [
//         interact.modifiers.restrictEdges({
//           inner: mediaElem
//         }),
//         ],
      listeners: {
        start:function(event){
          mediaPos.width=parseFloat(mediaElem.style.width)||mediaElem.videoWidth||0
          mediaPos.height=parseFloat(mediaElem.style.height)||mediaElem.videoHeight||0
          
          if((isNaN(mediaPos.width)||
             mediaPos.width==''||
             mediaPos.width==null||
             mediaPos.width<=0)
            &&
             (isNaN(mediaPos.height)||
             mediaPos.height==''||
             mediaPos.height==null||
             parseFloat(mediaPos.height<=0))){
                //technically i should wait for video.loadeddata or video.loadedmetadata event and read video.videoWidth
                mediaPos.width=300
             }
          
          initGestDist=event.distance
        startFn()
        },
        move (event) {
          let style = mediaElem.style
          //let angleDelta = currentAngle-event.angle
          //let vector = angleDelta
          //let vector = event.scale*currentScale
          //currentScale=vector
          let initGestDelta=event.distance-initGestDist
          console.log(mediaPos.width,initGestDist-event.distance,style.height)
          //let vector = (Math.abs(event.dy)>Math.abs(event.dx))?event.dy:event.dx;
          if(style.height=="auto"||style.height==''||style.height==null||parseFloat(style.height<=0)){
            style.width=mediaPos.width+initGestDelta+'px'
             if(gappingOnSide(target,mediaElem)){
               style.width=mediaPos.width+'px'
              }
          }else{
            style.height=mediaPos.height+initGestDelta+'px'
             if(gappingOnSide(target,mediaElem)){
               style.width=mediaPos.height+'px'
              }
          }

          dragMoveFn(mediaElem,event.dx,event.dy)
           if(gappingOnSide(target,mediaElem)){
             dragMoveFn(mediaElem,event.dx*-1,event.dy*-1)
           }
        },
        end:function(){
          mediaPos.width=parseFloat(mediaElem.style.width)||0
          mediaPos.height=parseFloat(mediaElem.style.height)||0
          endFn()
        }
      }
  })
  startEditMode()
}


//document.querySelectorAll('.craft').forEach(craftIt)



