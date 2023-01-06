
let ensureOverlap=function(elem1,elem2){
  let rect1=elem1.getBoundingClientRect()
  let rect2=elem2.getBoundingClientRect()
  let notCollide=''
  if(rect1.left < rect2.left){
    notCollide+='right'
  }
  if(rect1.left > rect2.left){
    notCollide+='left'
  } 
  if(rect1.bottom > rect2.bottom){
    notCollide+='bottom'
  }
  if(rect1.top < rect2.top){
    notCollide+='top'
  }
  console.log('need to fix=',notCollide)
}

let craft = function(target){
  target.classList.add('events-none')
  target.classList.add('craft')
  let debounceId;
  let resetDebounce=5000
  let editMode=false
  let currentAngle=0
  let currentScale=1
  let currentWidth=0
  let currentHeight=0
  let initGestDist=0
  let mediaElem=target.querySelector('video,img')
  
  
  let startFn=function(event) {
    clearTimeout(debounceId)
  }
  let endFn=function(event) {
    ensureOverlap(target,mediaElem)
    
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
  let dragMoveFn=function (target,dx,dy) {
          if(!editMode){
            return
          }
    
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

          // update the element's style
          target.style.width = event.rect.width + 'px'
          target.style.height = event.rect.height + 'px'

          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top

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
    })  .gesturable({
      listeners: {
        start:function(event){
          currentWidth=parseFloat(mediaElem.style.width)||mediaElem.videoWidth||0
          currentHeight=parseFloat(mediaElem.style.height)||mediaElem.videoHeight||0
          
          if((isNaN(currentWidth)||
             currentWidth==''||
             currentWidth==null||
             currentWidth<=0)
            &&
             (isNaN(currentHeight)||
             currentHeight==''||
             currentHeight==null||
             parseFloat(currentHeight<=0))){
             currentWidth=300
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
          console.log(currentWidth,initGestDist-event.distance,style.height)
          //let vector = (Math.abs(event.dy)>Math.abs(event.dx))?event.dy:event.dx;
          if(style.height=="auto"||style.height==''||style.height==null||parseFloat(style.height<=0)){
            style.width=currentWidth+initGestDelta+'px'
          }else{
            style.height=currentHeight+initGestDelta+'px'
          }
          dragMoveFn(mediaElem,event.dx,event.dy)
        },
        end:function(){
          currentWidth=parseFloat(target.style.width)||0
          currentHeight=parseFloat(target.style.height)||0
          endFn()
        }
      }
  })
  startEditMode()
}


//document.querySelectorAll('.craft').forEach(craftIt)



