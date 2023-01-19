//DEVNOTE: matching deviceid to trackid
//https://stackoverflow.com/questions/66048083/enumeratedevices-after-getusermedia-how-to-find-the-active-devices

let craftZone = function(id, geometry) {
	let zone = document.createElement('div');
	zone.id = id;
	zone.className=geometry.className
	
	Object.keys(geometry).forEach(function(key) {
		//filter out keys that arent style
		if (key == 'enhance' || key == 'secondary' || key == 'terciary' || key == 'className') {
			return
		}
		zone.style[key] = geometry[key]
	})

	let enhance;
	if (geometry.enhance) {
		enhance = craftZone(`${id}_enhance`, geometry.enhance)
	}

	let isOver=false;
	let targetPointer={}
	let maxInt=999999999
	
	let snap=function(bool){
		if(bool==null){
			bool = !instance.snapOn
		}
		if(bool){
			instance.snapOn=true
			var dropRect = interact.getElementRect(zone)
			targetPointer.x=dropRect.left + dropRect.width / 2;
			targetPointer.y=dropRect.top + dropRect.height / 2;
			//targetPointer.range=Math.sqrt(dropRect.width*dropRect.width + dropRect.height*dropRect.height);
		}else{
			instance.snapOn=false
			targetPointer.x=-maxInt
			targetPointer.y=-maxInt
		}
		return targetPointer
			
	}

	if (!(id.indexOf('enhance') >= 0)) {
		// enable draggables to be dropped into this
		let interactable = interact(zone)
			.dropzone({
				// only accept elements matching this CSS selector
				accept: '.craft',
				// Require a 5% element overlap for a drop to be possible
				overlap: 0.05,

				// listen for drop related events:
				ondropactivate: function(event) {
					// add active dropzone feedback
					event.target.classList.add('active')
					if(instance.assCraft && instance.assCraft.assZone === instance){
						return snap(true)
					}
					//snap(false)
				},
				ondragenter: function(event) {
					isOver=true
					if(instance.assCraft && instance.assCraft.assZone === instance){
						return snap(true)
					}
					//snap(false)
				},
				ondragleave: function(event) {
					isOver=false
					//snap(false)

					// remove the drop feedback style
					event.target.classList.remove('targeted')
					event.relatedTarget.classList.remove('can-drop')
				},
				ondrop: function(event) {
					// attach the zone with the view
					let elem = event.relatedTarget
					let craftInstance = craft.instances[elem.id]
					let zone = event.target

					let rect = interact.getElementRect(event.target);
					// record center point when starting the very first a drag
					let center1 = {
						x: rect.left + rect.width / 2,
						y: rect.top + rect.height / 2
					}
					rect = interact.getElementRect(event.relatedTarget);
					// record center point when starting the very first a drag
					let center2 = {
						x: rect.left + rect.width / 2,
						y: rect.top + rect.height / 2
					}
					let tolerance=5;
					if (Math.abs(center1.x - center2.x) <= tolerance && Math.abs(center1.y - center2.y) <= tolerance) {
						craftInstance.associate(instance)
					}
				},
				ondropdeactivate: function(event) {
					// remove active dropzone feedback
					event.target.classList.remove('active')
					event.target.classList.remove('target')
				}
			})
	}

	let instance = {
// 		targetGetter:function(){
// 			if(isOver){
// 				return getCenter()
// 			}
// 			return {}
// 		},
		id:id,
		isPrimary:zone.id.indexOf('enhance') < 0,
		elem: zone,
		snap:snap,
		targetPointer:targetPointer,
		unscaledGeometry: geometry,
		enhance: enhance,
		saveGeoMods: function() {
			console.log('alert saving of geeo mods')
			let geometry = {}
			let associated = document.getElementById(instance.assCraft)
			//localStorage.setItem(id + "." + associated.id, JSON.stringify(geometry))
		}
	}
	enhance && (enhance.main=instance)
	craftZone.instances[id] = instance
	if (enhance) {
		craftZone.instances[enhance.elem.id] = enhance
		instance.enhance = enhance
	}
	return instance
}
craftZone.instances = {}


//to gesture move the inside use "options.panMedia"
//that option is buggy though so its optional

//if you are adding a video add the video after the video.loadeddata or video.loadedmetadata event
// whichever makes sure you can ge the video.videoWidth variable
let gappingOnSide = function(elem1, elem2) {
	let rect1 = elem1.getBoundingClientRect()
	let rect2 = elem2.getBoundingClientRect()
	let notCovering = ''
	//let dems={}

	if (rect1.left < rect2.left) {
		notCovering += 'left'
		//dems.x=rect1.left
	}
	if (rect1.right > rect2.right) {
		notCovering += 'right'
	}
	if (rect1.bottom > rect2.bottom) {
		notCovering += 'bottom'
	}
	if (rect1.top < rect2.top) {
		notCovering += 'top'
		//dems.y=rec1.dataset.y
	}

	console.log('need to fix=', notCovering)
	return notCovering
}

function getDistance(x1, y1, x2, y2){
    let y = x2 - x1;
    let x = y2 - y1;
    
    return Math.sqrt(x * x + y * y);
}

let craft = function(target, mediaElem, zone, options) {
	options = Object.assign({
		gesturePans: false
	}, options || {})
	
	let initGestDist = 0
	let dropSnapRange = 100
	let editDebounceId = null;
	let resetDebounce = 5000
	let resetDebounceCustom
	let actions = 0
	let startFn = function(event) {
		actions++
		clearTimeout(editDebounceId)
	}
	let endFn = function(event) {
		actions--
		if (actions == 1) {
			//TODO future optimization. Only check for collision at the end of the move
			// then calculate difference to move the elemet to proper position
			//gappingOnSide(target,mediaElem)

			editDebounceId = setTimeout(endEditMode, resetDebounceCustom || resetDebounce)
		}
	}

	let endEditMode = function() {
		resetDebounceCustom = 0
		clearTimeout(editDebounceId)
		editMode = false
		target.dataset.editmode = false
		target.classList.remove('edit-mode')
		target.classList.add('animate-transition')
		mediaElem.classList.add('animate-transition')
	}
	let startEditMode = function(inital) {
		resetDebounceCustom = inital
		editMode = true
		target.dataset.editmode = true
		target.classList.add('edit-mode')
		target.classList.remove('animate-transition')
		mediaElem.classList.remove('animate-transition')
		let updateGhost = function() {
			if (!editMode) {
				return
			}
			let box = interact.getElementRect(mediaElem)
			let style = videoGhost.style
			style.left = (box.left) + 'px'
			style.top = (box.top) + 'px'
			style.width = (box.width || mediaElem.videoWidth || 20) + 'px'
			style.height = (box.height || mediaElem.videoHeight || 20) + 'px';

			return setTimeout(function() {
				requestAnimationFrame(updateGhost)
			}, 1)
		}
		updateGhost()
	}
	let dragMoveFn = function(target, x, y) {
		if (y == null) {
			let event = x
			x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
			y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
		}
		// translate the element
		target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

		// update the posiion attributes
		target.setAttribute('data-x', x)
		target.setAttribute('data-y', y)
	}
	let handles = {
		/*tl:'circle',br:'circle',tr:'corner',bl:'corner',*/
		mr: 'circle',
		ml: 'circle',
		mt: 'circle',
		mb: 'circle',
		mc: 'cross',
		'transition-indicator': 'cross'
	}

	let minWidth = 100
	let minHeight = 100

	let offsetPointer={x:0,y:0}
	let mediaPos;
	let lastSafe;
	let init = function() {
		mediaPos = Object.assign({
			angle: 0,
			scale: 0
		}, mediaElem.getBoundingClientRect())
		lastSafe = Object.assign({}, mediaPos)
		let aspectRatio = (mediaElem.videoWidth || mediaPos.width) / (mediaElem.videoHeight || mediaPos.height)


		//add handles
		Object.keys(handles).forEach(function(key) {
			let elem = document.createElement('div')
			elem.className = 'handle ' + ((key || '').trim() + ' ' + (handles[key] || '').trim()).trim()
			//elem.textContent="&nbsp;";
			target.appendChild(elem) //.insertBefore(elem,target.firstChild)
			handles[key] = elem;
		})

		let zones = []
		let startPos = null
		let snappedToMedia = false
		let interactable = interact(target).pointerEvents({
				holdDuration: 5000,
			}).styleCursor(false)

			//         .resizable({
			//         edges: { left: handles.tl,
			//                 right: handles.br,
			//                 bottom: handles.br,
			//                 top: handles.tl
			//         },

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
			//    interact.modifiers.aspectRatio({
			//      // make sure the width is always double the height
			//      ratio: aspectRatio,
			//      // also restrict the size by nesting another modifier
			//    modifiers: [
			//      // keep the edges inside the parent
			//      interact.modifiers.restrictEdges({
			//      outer: mediaElem
			//      }),
			//      //interact.modifiers.restrictSize({ max: 'parent' }),
			//      // keep the edges inside the parent
			//      interact.modifiers.restrictEdges({
			//        outer: 'parent'
			//      }),
			//      interact.modifiers.restrictSize({
			//        min: { width: 50, height: 50 }
			//      })
			//        ],
			//    }),
			//         ],
			//         inertia: false
			//       })

			.resizable({
				edges: {
					left: handles.ml,
					right: handles.mr,
					bottom: handles.mb,
					top: handles.mt
				},

				listeners: {
					start: startFn,
					move(event) {
						if (!editMode) {
							return
						}
						var x = (parseFloat(target.getAttribute('data-x')) || 0)
						var y = (parseFloat(target.getAttribute('data-y')) || 0)
						let width, height;
						if (event.matchRect) {
							let box = event.matchRect
							width = box.width
							height = box.height
							x = box.left;
							y = box.top
						} else {
							// translate when resizing from top or left edges
							x += event.deltaRect.left
							y += event.deltaRect.top

							// update the element's style
							width = event.rect.width
							height = event.rect.height
						}
						target.style.width = width + 'px'
						target.style.height = height + 'px'
						target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
						target.setAttribute('data-x', x)
						target.setAttribute('data-y', y)

					},
					end: function(event) {
						let zone = getZone();
						if (zone) {
							zone.saveGeoMods()
						}
						endFn(event)
					}
				},
				modifiers: [
					// keep the edges inside the parent
					interact.modifiers.restrictEdges({
						outer: mediaElem
					}),

					// minimum size
					interact.modifiers.restrictSize({
						min: {
							width: minWidth,
							height: minHeight
						},
						// max: mediaElem
					}),
					interact.modifiers.restrictEdges({
						outer: 'parent',
						endOnly:true
					})

				],
				inertia: false
			})

			.draggable({
				listeners: {
					start: function(event) {
						if (!editMode) {
							return
						}
						startFn(event)
					},
					move: function(event) {
						if (!editMode) {
							return
						}
						console.log('dragmove',event.x0,event.y0,event.dx,event.dy,event)
						if(!target.classList.contains('is-icon') && getDistance(event.x0,event.y0,event.client.x,event.client.y)>dropSnapRange){
							associate(null, true)
							let geometry = getGeometry()//event /*,offsetPointer*/)
							resizeTo(geometry)
// 							interactable.fire({
// 								type: 'dragend',
// 								target: target,
// 							});
// 							interactable.fire(event);
							Object.keys(craftZone.instances).forEach(function(key) {
								if(key.indexOf('fullscreen')>=0){return}
								let assZone = craftZone.instances[key]
								let snapTarget = assZone.snap(assZone.isPrimary)
								zones.push(snapTarget)
							})
							return
						}
						
						dragMoveFn(target, event)
					},
					end: function(event) {
						if (!editMode) {
							return
						}
						endFn(event)
					}
				},
				inertia: true,
				modifiers: [
					interact.modifiers.restrictRect({
						restriction: 'parent',
						//endOnly:true
					}),	
					interact.modifiers.snap({
						targets: zones,
						//offset: offsetPointer,
						relativePoints: [
							{ x: 0.5, y: 0.5 },   // to the center
						],
						range:dropSnapRange
					})
				]
			})
			.on('tap', function(event) {
				console.log('enhance swap', event)
				let zoneInstance = instance.assZone
				if(!zoneInstance){return}
				if(zoneInstance.isPrimary){
				   associate(zoneInstance.enhance)
				}else{
				   associate(zoneInstance.main)
				}
			})
			.on('doubletap', function(event) {
				console.log('main swap')
				let zoneInstance = instance.assZone
				if(!zoneInstance){return}
				if(zoneInstance.isMain){
					associate(instance.lastZone)
				}else{
					associate(zoneInstance)
				}
			})
			.on('hold', function(event) {
				startEditMode()
			})
			.gesturable({
				listeners: {
					start: function(event) {
						let box1 = interact.getElementRect(target)
						let box2 = interact.getElementRect(mediaElem)
						mediaPos.width = box2.width || mediaElem.videoWidth || 0
						mediaPos.height = box2.height || mediaElem.videoHeight || 0
						initGestDist = event.distance
						startFn()
						let toler = 5;
						if (Math.abs(box1.left - box2.left) <= toler &&
							Math.abs(box1.top - box2.top) <= toler &&
							Math.abs(box1.width - box2.width) <= toler &&
							Math.abs(box1.height - box2.height) <= toler) {
							snappedToMedia = true
						}
					},
					move(event) {
						if (!editMode) {
							return
						}
						let style = mediaElem.style
						//let angleDelta = currentAngle-event.angle
						//let vector = angleDelta
						//let vector = event.scale*currentScale
						//currentScale=vector
						let initGestDelta = event.distance - initGestDist
						console.log(mediaPos.width, initGestDist - event.distance, style.height)
						//let vector = (Math.abs(event.dy)>Math.abs(event.dx))?event.dy:event.dx;
						let isGap = ''
						if (style.height == "auto" || style.height == '' || style.height == null || parseFloat(style.height <= 0)) {
							style.width = mediaPos.width + initGestDelta + 'px'
							isGap += gappingOnSide(target, mediaElem)
						} else {
							style.height = mediaPos.height + initGestDelta + 'px'
							isGap += gappingOnSide(target, mediaElem)
						}
						// keep the dragged position in the data-x/data-y attributes
						if (options.gesturePans=='media') {
							dragMoveFn(mediaElem, event)
						} else if (options.gesturePans=='crop') {
							dragMoveFn(target, event)
						}
						isGap += gappingOnSide(target, mediaElem)
						if (!isGap) {
							lastSafe = Object.assign(lastSafe, mediaElem.getBoundingClientRect())
						}
						//interactable.reflow({ name: 'drag', axis: 'xy' })

						if (snappedToMedia) {
							resizeTo(interact.getElementRect(mediaElem))
						}
					},
					end: function() {
						snappedToMedia = false

						// start a resize action and wait for inertia to finish
						interactable.reflow({
							name: 'resize',
							edges: {
								right: true,
								bottom: true,
							},
							isReflow:true
						})
						endFn()
					}
				}
			})


		let getZone = function() {
			let zone = instance.assZone
			if (zone && zone.assCraft && zone.assCraft.id == instance.id) {
				return zone
			}
		}
		//takes a object created via Craft.getGeometry(), Element.getBoundingClientRect() or interact.getElementRect(element)
		//Craft.getGeometry() will give best resutls because it parses out mediaWidth/mediaHeight
		let resizeTo=function(matchRect,order){
			let zoneInstance = getZone()
			
			if(zoneInstance){
				instance.elem.classList.remove('is-icon')
				videoGhost.classList.remove('d-none')
			}else{
				instance.elem.classList.add('is-icon')
				videoGhost.classList.add('d-none')
			}
			
			// render media first
			let mediaRect=interact.getElementRect(mediaElem)
			let style = mediaElem.style;
			
			//not actaully scalar but pretend it is cause I just want to see which is longer
			let wScalar = mediaElem.videoWidth || mediaRect.width
			let hScalar = mediaElem.videoHeight || mediaRect.height 
	
			//if (wScalar > hScalar) {
			if (style.height == "auto" || style.height == '' || style.height == null || parseFloat(style.height <= 0)) {
				mediaElem.style.width = `${matchRect.mediaWidth || matchRect.width}px`
			} else {
				mediaElem.style.height = `${matchRect.mediaHeight || matchRect.height}px`
			}
			
			//old resizeTo code
			if(!order){
				order=['start','move','end']
			}
			order.forEach(function(action){
				let obj = {
					type: `resize${action}`,
					target: target,
					matchRect:matchRect,
				}
				interactable.fire(obj);
			})
		}
		let associate = function(zoneInstance,dontResize) {
			zoneInstance = zoneInstance || undefined
// 			if (instance && !instance.emulateDrop) {
// 				if (!instance.isReflow) {
// 					return
// 				}
// 			}
			
			//if theres something in the zone free it
			let assCraft = zoneInstance && zoneInstance.assCraft
			if (assCraft && assCraft!=instance) {
				//assCraft.associate()
				let zone = getZone()
				if (zone) {
					//free them
					zone.assCraft.assZone= null
					zone.assCraft= null

				//	reflow({
				//		emulateDrop: false
				//	})
				//      interactable.fire({
				//        type: 'dragstart',
				//        target: element,
				//        dx: 20,
				//        dy: 20,
				//      });
				}
			}

			
			//link zone and craft
			if(zoneInstance){
				zoneInstance.assCraft=instance
				zoneInstance.snap(true); //turn on snaps
			}
			instance.assZone=zoneInstance
			
			
			
			if(!dontResize){
				let geometry = getGeometry()
				resizeTo(geometry)
			}
			    
			//add animation classes after resize
			//resize intaractjs has constraints that conflict with animations
			//so add them after
			target.classList.add('animate-transition')
			mediaElem.classList.add('animate-transition')
			
		}
		let getGeometry = function(event,pointer){
			let zoneInstance = instance.assZone
			//associate data
			let zoneId=zoneInstance && zoneInstance.id
			let geoLocalUserMod = JSON.parse(localStorage.getItem([zoneId,instance.id].join(' ').trim()) || '{}')
			//let kqStyleGeo = zoneInstance.geometry //The original geometry I used to calculate via a kqstyle aspect ratio
			let domGeo = (zoneInstance)?interact.getElementRect(zoneInstance.elem):{left:(window.innerWidth/3),top:(window.innerHeight/3),width:(window.innerWidth/5),height:(window.innerHeight/5)};
			// furthest to the right has priority -->
			let geometry = Object.assign({}, domGeo, geoLocalUserMod)
			
			
			if(!zoneInstance){ //as icon
				geometry.width=minWidth;
				geometry.height=minHeight
				if(event){
					let diffX=(event.x0+event.dx)-(geometry.width/2)
					let diffY=(event.y0+event.dy)-(geometry.height/2)
		
					pointer && (pointer.x=geometry.left-diffX)
					pointer && (pointer.y=geometry.top-diffY)
					
					geometry.left=diffX
					geometry.top=diffY
				}
			}
		
			return geometry
		}
		let edit = function() {
			alert('edit on craft public interface not implmeneted')
		}
		let reflow = function(opts) {
			return
			Object.assign(instance, opts)
			interactable.reflow({
				name: 'resize',
				edges: {
					left: true,
					top: true,
				},
				isReflow:true
			})
			interactable.reflow({
				name: 'drag',
				axis: 'xy',
				isReflow:true
			})
		}
		//promise.resolve(
		let instance = {
			id:id,
			associate:associate,
			edit: edit,
			elem:target,
			mediaElem:mediaElem,
			reflow: reflow,
			getGeometry:getGeometry,
			resizeTo:resizeTo,
		}
		craft.instances[target.id] = instance
		startEditMode(120000)
		if(zone){
			console.error('implement assoicate zone please')
		}		      
		//associate(null)
		//resizeTo(instance.asIcon(true))
		//let promise=new Promise()
		//return promise

	}

	//main
	if(!document.contains(target)) {
		document.body.appendChild(target)
	}
	target.classList.add('events-none')
	target.classList.add('craft')
	let editMode = false
	let id=target.id
	
	let editModeCover = document.createElement('div')
	editModeCover.className='edit-cover'
	editModeCover.style.display='none';

	
	let videoGhost = document.createElement('div')
	videoGhost.className = 'video-ghost'
	document.body.insertBefore(videoGhost, target)

	target.appendChild(mediaElem)
	target.appendChild(editModeCover)
	mediaElem.classList.add('craft-cargo')
	switch(mediaElem.tagName.toUpperCase()){
		case 'VIDEO':
			if (!mediaElem.videoWidth || mediaElem.videoWidth == null) {
				mediaElem.addEventListener("loadedmetadata", function(e) {
					init()
				})
			}else{
				init()
			}
		break;
		case 'IMG':
		case 'CANVAS':
			init()
		break;
		default:
			init()
	}
}
craft.instances = {}


let animationFrameId = 0
window.addEventListener('resize', function() {
	cancelAnimationFrame(animationFrameId)
	window.requestAnimationFrame(function() {
		Object.keys(craft.instances).forEach(function(key) {
			let inst = craft.instances[key]
			inst.reflow({
				emulateDrop:false,
				isReflow:true,
			})
		})
	});
}, true);
