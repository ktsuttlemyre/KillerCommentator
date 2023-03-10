window.SVGScribble=(function(document,SVGScribble,pp){let inject=pp.inject, appendTo=pp.appendTo, prependTo=pp.prependTo, ajax=pp.ajax, domParse=pp.domParse;
	appendTo('head',inject('link',{href:KillerCommentator.base_site+"style.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"}))
	appendTo(document.body,inject('script',{src:"https://kit.fontawesome.com/48764efa36.js", crossorigin:"anonymous"},function(){
		  // remote script has loaded
	      }));


	SVGScribble.init=function(parent){
		let instance = {
			state:false,
			clear:function(){
				(document.querySelectorAll("#drawing-box-${id} .drawing-el")||[]).forEach(function (elem) {elem.remove()});
			},
			toolbar:function(opt){
				if(opt=='hide'){
					document.querySelector(`#drawing-box-${id}`).style.display='none'
				}else{
					document.querySelector(`#drawing-box-${id}`).style.display='block'
				}
			},
			close:function(){
				document.body.setAttribute('data-drawing', false);
				state.drawing = false;
			},
			show:function(){
				document.body.setAttribute('data-drawing', true);
				state.drawing = true;
			},
			toggle:function(){
				// Set the body attribute 'data-drawing' to true or false, based on if the user clicks the 'Start Drawing' button
				// Also sets config.drawing to true or false.
				let drawing = state.drawing;
				state.drawing = !drawing;
				document.body.setAttribute('data-drawing', !drawing)
			}		
		}
		let id = instance.id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
		parent = parent || document.body;

		let bar = KillerCommentator.drawingBar.cloneNode(true)
		bar.id = `drawing-box-${id}`
		bar.className='drawing-box'
		appendTo(document.body,bar)
		
		var pointAttrs='pageX,pageY,timeStamp,pointerId'.split(',')
		let setPoint=function(e){
			if(!paths[e.pointerId]){return}
			let point={}
			for(var i=0,l=pointAttrs.length;i<l;i++){
				point[pointAttrs[i]]=e[pointAttrs[i]]
			}
			let bounds = drawing_layer.getBoundingClientRect();
			point.relativeX=e.clientX - bounds.left;
			point.relativeY=e.clientY - bounds.top;
			paths[e.pointerId].push(point)
			events[e.pointerId].push(e)
			return point
		}
		function getDistance(x1, y1, x2, y2){
		    let y = x2 - x1;
		    let x = y2 - y1;

		    return Math.sqrt(x * x + y * y);
		}
		
		instance.state='initializing'
		// Ensure drawing layer is at root
		var drawing_layer = document.createElement('div')
		drawing_layer.id=`drawing-layer-${id}`
		drawing_layer.className='drawing-layer'
		parent.appendChild(drawing_layer);
		var drawing_cover = document.createElement('div')
		drawing_cover.id=`drawing-cover-${id}`
		drawing_cover.className='drawing-cover'
		parent.appendChild(drawing_cover);

		// Manage Main UI
		// Add a pointerdown event for each color and tool.
		// When a user clicks a color or tool, then we set it to our current config.color or config.tool respectively, and highlight it on the UI
		[ 'data-rColor', 'data-tool' ].forEach(function(i) {
			document.querySelectorAll(`[${i}]`).forEach(function(item) {
				item.addEventListener('pointerdown', function(e) {
					e.target.releasePointerCapture(e.pointerId);
					document.querySelectorAll(`[${i}]`).forEach(function(i) {
						i.setAttribute('data-current', false);
					});
					item.setAttribute('data-current', true);
					if(i == 'data-rColor') {
						config.color = item.getAttribute(i);
					} else if(i == 'data-tool') {
						config.tool = item.getAttribute(i);
					}
				});
			});
		});

		var config = {
			tool: 'commentator',       // The currently selected tool //commentator arrow
			color : 'white',        // The currently selected colour
			colorAlt : '#50aeef',
			strokeWidth: 4,         // The width of the lines we draw
			normalisation: 6,// The average normalisation for pencil drawing

		}

		var state = {
			drawing: false,         // Set to true if we are drawing, false if we aren't
			pointerTypes: {
				mouse:0,
				pen:1,
				touch:1,
				},
			deadZone:40,
		}


		let arrow = {}
		let paths = {}
		let events = {}
		let freeHand = {}

		let svgEl = {
			arrowPath: (start, dimensions, path, dummy, direction, end, angle, hyp, id) => 
			`<div class="arrow drawing-el static" data-id="${id}" id="${id}" data-direction="${direction}" 
				style="left: ${start[0]}px; top: ${start[1]}px; height: ${dimensions[1]}px; width: ${dimensions[0]}px;">
				<div class="arrow-point arrow-point-one"></div>
				<div class="arrow-point arrow-point-two" style="
					transform-origin: 0 0; left: ${hyp[1]}px; top: ${hyp[2]}px; transform: rotateZ(${angle}deg) translateY(-${hyp[0]}px) translateX(-15px);
				"></div>
				<svg viewbox="0 0 ${dimensions[0]} ${dimensions[1]}">
					<defs>
						<marker id="arrow-head-${id}-1" class="arrow-resizer" markerWidth="10" markerHeight="10" refX="1" refY="3" 
						orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20" stroke-opacity="0.7" opacity="0.7">
							<path d="M0 0 L0 6 L9 3 z" fill="${config.colorAlt}" />
						</marker>
						<marker id="arrow-head-${id}-2" class="arrow-resizer" markerWidth="10" markerHeight="10" refX="0" refY="3" 
						orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20">
							<path d="M0 0 L0 6 L9 3 z" fill="${config.color}" />
						</marker>
						<marker id="arrow-head-${id}-3" class="arrow-resizer" markerWidth="12" markerHeight="12" refX="0" refY="3" 
						orient="auto" markerUnits="strokeWidth" viewBox="0 0 20 20" stroke-opacity="0" opacity="0">
							<path d="M0 0 L0 6 L9 3 z" fill="#FF00FF" />
						</marker>
					</defs>
					<path marker-start="url(#bottom-marker)" style="stroke: ${config.colorAlt}; stroke-width: ${config.strokeWidth+2}" marker-end="url(#arrow-head-${id}-1)" class="arrow-line" d="${path}"></path>
					<path marker-start="url(#bottom-marker)" style="stroke: ${config.color}; stroke-width: ${config.strokeWidth}" marker-end="url(#arrow-head-${id}-2)" class="arrow-line" d="${path}"></path>
					<path marker-start="url(#bottom-marker)" style="stroke: #FF00FF; stroke-width: ${config.strokeWidth+6}" marker-end="url(#arrow-head-${id}-3)" class="arrow-line" d="${path}" stroke-opacity="0" opacity="0"></path>
				</svg>
			</div>`,
			drawPath: (start, dimensions, path, id) => 
			`<div class="free-hand drawing-el static" data-id="${id}" id="${id}" style="left: ${start[0]}px; top: ${start[1]}px; height: ${dimensions[1]}px; width: ${dimensions[0]}px;">
				<svg viewbox="0 0 ${dimensions[0]} ${dimensions[1]}">          
					<path d="${path}" style="stroke: ${config.colorAlt}; stroke-width: ${config.strokeWidth+2}; stroke-opacity:0.7; opacity:0.7"></path>
					<path d="${path}" style="stroke: ${config.color}; stroke-width: ${config.strokeWidth}"></path>	
					<path d="${path}" style="stroke: #FF00FF; stroke-width: ${config.strokeWidth+6}; stroke-opacity:0; opacity:0"></path>	
				</svg>
			</div>`
		}

		// Closes the drawing box and sets 'data-drawing' on the body element to false
		// Along with state.drawing to false.
		document.querySelector(`#drawing-box-${id} .close`).addEventListener('mousedown', function(e) {
			instance.close()
		})
		document.querySelector(`#drawing-box-${id} .trash`).addEventListener('pointerdown', function(e) {
			e.target.releasePointerCapture(e.pointerId);
			instance.clear();
		})

		drawing_cover.addEventListener('pointerdown', function(e) {
			if(!e.isTrusted){return}
			if(state.drawing == false){return}
			if(!state.pointerTypes[e.pointerType]){ return }
			
			//filters out other div layers we dont want to draw on due to event bubbling 
	// 		if(helper.parent(e.target, `#drawing-box-${id}`, 1) !== null && helper.parent(e.target, `#drawing-box-${id}`, 1).matches(``#drawing-box-${id}`)) {
	// 			return false;
	// 		}
			console.debug("pointer down on draw layer",e.pageX,e.pageY,e.target,e)
			// Generate id for each element
			let id = helper.generateId();
			
			events[e.pointerId]=[]
			paths[e.pointerId]=[]
			
			let point = setPoint(e)
			paintStart(e,config,id,point);		
		})

		drawing_cover.addEventListener('pointermove', function(e) {
			if(!e.isTrusted){return}
			if(state.drawing == false){return}
			if(!state.pointerTypes[e.pointerType]){ return }
			
			//filters out other div layers we dont want to draw on due to event bubbling 
	// 		if(helper.parent(e.target, `#drawing-box-${id}`, 1) !== null && helper.parent(e.target, `#drawing-box-${id}`, 1).matches(``#drawing-box-${id}`)) {
	// 			return false;
	// 		}
			
			console.debug('pointermove on draw layer',e.pageX,e.pageY,e.target,e)
			
			let point = setPoint(e)
			paintMove(e,config,point)	
		});

		// Whenever the user leaves the page with their mouse or lifts up their cursor
		[ 'mouseleave', 'pointerup' ].forEach(function(item) {
			drawing_cover.addEventListener(item, function(e) {
				if(!e.isTrusted){return}
				//purposely dont check for drawing state in case it changed mid line draw
				//if(state.drawing == false){return}
				if(e.type == 'pointerup' && !state.pointerTypes[e.pointerType]){ return }
				
				let point
				
				//filters out other div layers we dont want to draw on due to event bubbling 
				// 		if(helper.parent(e.target, `#drawing-box-${id}`, 1) !== null && helper.parent(e.target, `#drawing-box-${id}`, 1).matches(`#drawing-box-${id}`)) {
				// 			return false;
				// 		}

				console.debug('pointerup/mouseleave',e.pageX,e.pageY,e.target,e)
				
				if(paths[e.pointerId] && paths[e.pointerId].length<=state.deadZone){
					if(config.tool == 'commentator'){
						if(arrow.pointerIds && arrow.pointerIds.length==1){
							console.log('clicked')
							//pass the original event
							drawing_layer.click(events[e.pointerId][0]);
							//todo if this is networked then this is where you tell the sever to delete the last elemen6 c
							arrow={}
						}else{
							if(!arrow.pointerIds || !arrow.pointers || arrow.pointerIds[0] == null || arrow.pointers[arrow.pointerIds[0]] == null){
								console.log('debugger')
							}
							paintArrowStart(arrow,config)
							paintArrowEnd(arrow,config)
						}
					}else{
						console.log('clicked')
						//pass the original event
						drawing_layer.click(events[e.pointerId][0]);
						//todo if this is networked then this is where you tell the sever to delete the last elemen6 c
					}
				}else{
					point = setPoint(e)
				}
				paintEnd(e,config,point)
				
			});
		});
		
		
		paintArrowStart=function(arrow,config){
			let e=arrow.pointers[arrow.pointerIds[0]][0]
			let e2=e;
			if(config.tool == 'commentator' && arrow.pointerIds[1]){
				let history = arrow.pointers[arrow.pointerIds[1]]
				e2 = history[history.length-1];
			}
			
			// Add element to drawing layer
			var wrapper= document.createElement('div');
			wrapper.innerHTML= svgEl.arrowPath(  [ arrow.startX /*+ window.scrollX*/, arrow.startY /*+ window.scrollY*/ ], [  e.relativeX, e.relativeY ], `M0 0 L0 0`, 'arrow-item', arrow.arrowClasses[3], [ 0, 0 ], 0, [ 0, 0, 0 ], arrow.id );
			wrapper.firstChild.classList.add('current-item');
	// 		if(config.tool=='commentator'){
	// 		wrapper.firstChild.classList.add('d-none');
			wrapper.firstChild.classList.add(`pointerId-${e2.pointerId}`);

			drawing_layer.appendChild(wrapper.firstChild);

			arrow.pathElems=drawing_layer.querySelectorAll(`.arrow.current-item.pointerId-${e2.pointerId} path.arrow-line`);
			arrow.domElem=drawing_layer.querySelector(`.arrow.current-item.pointerId-${e2.pointerId}`);
			arrow.svgElem=drawing_layer.querySelector(`.arrow.current-item.pointerId-${e2.pointerId} svg`);
		}
		paintArrowEnd=function(arrow,config){
			let history = arrow.pointers[arrow.pointerIds[0]]
			if(config.tool == 'commentator' && arrow.pointerIds[1]){
				history = arrow.pointers[arrow.pointerIds[1]]
			}
			let e = history[history.length-1]
			// Then get the original start position
			let startX = arrow.startX;
			let startY = arrow.startY;
			// Set a default angle of 90
			let angleStart = 90;

			// And a default direction of 'south east'
			let arrowClass = arrow.arrowClasses[3];
			// Calculate how far the user has moved their mouse from the original position
			let endX = e.relativeX - startX// - window.scrollX;
			let endY = e.relativeY - startY// - window.scrollY;

			// And using that info, calculate the arrow's angle
			helper.calculateArrowLineAngle(endX, endY);
			// Then update the config to this new end position
			arrow.stopX = endX;
			arrow.stopY = endY;


			if(getDistance(arrow.startX,arrow.startY,arrow.stopX,arrow.stopY)>20){
				arrow.domElem.classList.remove('d-none');
			}
			// And update the HTML to show the new arrow to the user
			//todo update this to be cached instead of dom queried like freeHand.pathElems
			arrow.domElem.classList.remove('static');
			arrow.domElem.setAttribute('data-direction', arrow.activeDirection);
			arrow.svgElem.setAttribute('viewbox', `0 ${endX} 0 ${endY}`);
			arrow.pathElems.forEach(function(path){
				path.setAttribute('d', `M0 0 L${endX} ${endY}`);
			})
		}
		
		let paintStart = function(event,config,id,point){
			if(config.tool == 'arrow' || config.tool=='commentator') {
				if(!arrow.pointerIds){
					arrow={// startX, startY, and stopX, stopY store information on the arrows top and bottom ends
						startX: point.relativeX,
						startY: point.relativeY,
						stopX: null,      
						stopY: null,          
						activeDirection: 'se',                    // This is the current direction of the arrow, i.e. south-east
						arrowClasses: [ 'nw', 'ne', 'sw', 'se' ], // These are possible arrow directions
						lineAngle: 0,                             // This is the angle the arrow point at about the starting point
						domElem:null,
						pathElems:null,
						svgElem:null,
						pointers:{},
						pointerIds:[event.pointerId],
					}
					arrow.pointers[event.pointerId]=[event];
					if(config.tool=='arrow'){
						arrow.id=id
						paintArrowStart(arrow,config)
					}
				}else if(config.tool=='commentator' && arrow.pointerIds.length>=1){
					if(arrow.pointerIds.length==1){
						arrow.id=id
					}
					arrow.pointerIds.push(event.pointerId)
					arrow.pointers[event.pointerId]=[event];
				}

			}
			if(config.tool == 'freeHand' || config.tool=='commentator') {

				freeHand[event.pointerId]={
					currentPathText: `M${window.scrollX} ${window.scrollY} `,      // This is the current path of the pencil line, in text
					startX: point.relativeX,                       // The starting X coordinate
					startY: point.relativeY,                       // The starting Y coordinate
					lastMousePoints: [[ window.scrollX, window.scrollY ]],   // This is the current path of the pencil line, in array
					domElem:null,
					pathElems:null,
					id:id,
				}
				
				
				// Add element to the drawing layer
				var wrapper= document.createElement('div');
				wrapper.innerHTML=svgEl.drawPath( [ point.relativeX, point.relativeY ], [ point.relativeX, point.relativeY ], ``, id);
				wrapper.firstChild.classList.add('current-item')
				wrapper.firstChild.classList.add(`pointerId-${event.pointerId}`)
				
				drawing_layer.appendChild(wrapper.firstChild);
				freeHand[event.pointerId].pathElems=drawing_layer.querySelectorAll(`.free-hand.current-item.pointerId-${point.pointerId} svg path`);
				freeHand[event.pointerId].domElem=drawing_layer.querySelector(`.free-hand.current-item.pointerId-${point.pointerId}`);
			} 
			else if(config.tool == 'eraser') {
				// Check if user has clicked on an svg
				console.log('eraser clicked ',event.target,event)
				if(helper.parent(event.target, '.drawing-el', 1) !== null && helper.parent(event.target, '.drawing-el', 1).matches('.drawing-el')) {
					// If they have, delete it
					helper.parent(event.target, '.drawing-el', 1).remove();
				}
			}
		};
		let paintMove = function(event,config,point){
		// Assuming there is a current item to in the drawing layer
			if(drawing_layer.querySelector(`.current-item`) !== null) { 
				// If we are using the arrow tool
				if(config.tool == 'arrow' || config.tool=='commentator') {
					let history = arrow.pointers[event.pointerId]
					history.push(event)
					if(config.tool == 'arrow'){
						paintArrowEnd(arrow,config)
					}
				}
				
				if(config.tool == 'freeHand' || config.tool=='commentator') {
					// Similar to arrows, calculate the user's end position
					let endX = point.relativeX - freeHand[event.pointerId].startX;
					let endY = point.relativeY - freeHand[event.pointerId].startY;
					
					// And push these new coordinates to our config
					let newCoordinates = [ endX, endY ];
					freeHand[event.pointerId].lastMousePoints.push([endX, endY]);
					if(freeHand[event.pointerId].lastMousePoints.length >= config.normalisation) {
						freeHand[event.pointerId].lastMousePoints.shift();
					}
					
					// Then calculate the average points to display a line to the user
					let avgPoint = helper.getAveragePoint(0,event);
					if (avgPoint) {
						freeHand[event.pointerId].currentPathText += " L" + avgPoint.x + " " + avgPoint.y;

						let tmpPath = '';
						for (let offset = 2; offset < freeHand[event.pointerId].lastMousePoints.length; offset += 2) {
							avgPoint = helper.getAveragePoint(offset,event);
							tmpPath += " L" + avgPoint.x + " " + avgPoint.y;
						}

						// Set the complete current path coordinates
						freeHand[event.pointerId].domElem.classList.remove('static');
						freeHand[event.pointerId].pathElems.forEach(function(path){path.setAttribute('d', freeHand[event.pointerId].currentPathText + tmpPath)});
					}

				}
			}
			
		};
		let paintEnd = function(event,config,pointer){
				// Remove current-item class from all elements, and give all SVG elements pointer-events
				(drawing_layer.childNodes || []).forEach(function(item) {
					item.style.pointerEvent = 'all';
					if(item.classList.contains(`pointerId-${event.pointerId}`)){
						//should this be perminant or fade away
						if (!event.shiftKey && !event.ctrlKey) { //|| e.altKey 
							//make ephemerial
							item.classList.add('ephemeral');
							
							!(function(id){
								setTimeout(function(){
									let elem=document.getElementById(id);
									if(!elem){return}
									elem.parentElement.removeChild(elem);
								},10000)
							})(item.id)
						}
						item.classList.remove('current-item');
						item.classList.remove(`pointerId-${event.pointerId}`);
					}
					// Delete any 'static' elements
					if(item.classList.contains('static')) {
						item.remove();
					}
				});
				
			
				if(paths[event.pointerId] && paths[event.pointerId].length>state.deadZone){
					arrow={}
				}else if(arrow.pointerIds && arrow.pointerIds[1]==event.pointerId){
					arrow={}
				}
				// Reset freeHand variables where needed
				delete freeHand[event.pointerId]
				//this is where you would send the path to the server
				delete paths[event.pointerId]
				
		};


		let helper = {
			// This averages out a certain number of mouse movements for free hand drawing
			// To give our lines a smoother effect
			getAveragePoint: function(offset,event) {
				let len = freeHand[event.pointerId].lastMousePoints.length;
				if (len % 2 === 1 || len >= 4) {
					let totalX = 0;
					let totalY = 0;
					let pt, i;
					let count = 0;
					for (i = offset; i < len; i++) {
						count++;
						pt = freeHand[event.pointerId].lastMousePoints[i];
						totalX += pt[0];
						totalY += pt[1];
					}

					return {
						x: totalX / count,
						y: totalY / count
					}
				}
				return null;
			},
			// This calculates the angle and direction of a moving arrow
			calculateArrowLineAngle: function(lineEndX, lineEndY) {
				
				var calcLineEndX = lineEndX;
				var calcLineEndY = lineEndY;
				var angleStart = 90;
				var angle = 0;
				var a = calcLineEndX;
				var b = calcLineEndY;
				var c = Math.sqrt(Math.pow(lineEndX, 2) + Math.pow(lineEndY, 2));
				
				if(calcLineEndX <= 0 && calcLineEndY >= 0) {
					// quadrant 3
					angleStart = 180;
					angle = Math.asin(a/c) * -1 * (180/Math.PI);
					arrow.activeDirection = arrow.arrowClasses[2];
				} else if(calcLineEndY <= 0 && calcLineEndX >= 0) {
					// quadrant 1
					angleStart = 0;
					angle = Math.asin(a/c) * (180/Math.PI);
					arrow.activeDirection = arrow.arrowClasses[1];
				} else if(calcLineEndY <= 0 && calcLineEndX <= 0) {
					// quadrant 4
					angleStart = 270;
					angle = Math.asin(b/c) * -1 * (180/Math.PI);
					arrow.activeDirection = arrow.arrowClasses[0];
				}
				else {
					// quadrant 2
					angleStart = 90;
					angle = Math.asin(b/c) * (180/Math.PI);
					arrow.activeDirection = arrow.arrowClasses[3];
				}
				
				arrow.lineAngle = angle + angleStart;
			},
			// This generates a UUID for our drawn elements
			generateId: function() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},
			// This function matches parent elements allowing us to select a parent element
			parent: function(el, match, last) {
				var result = [];
				for (var parent = el && el.parentElement; parent; parent = parent.parentElement) {
					result.push(parent);
					if(parent.matches(match)) {
						break;
					}
				}
				if(last == 1) {
					return result[result.length - 1];
				} else {
					return result;
				}
			}
		}
		document.addEventListener('keydown',function(e) {
			 if (e.key === "Escape") { // escape key maps to keycode `27`
				document.body.setAttribute('data-drawing', false);
				state.drawing = false;
			}else if(e.key === "Backspace" || e.key === "Delete" || e.key === "Clear" || e.key === "D" || e.key === "d"){
				 instance.clear()
		}});
		instance.state='init'
		return instance
	}
	return SVGScribble;
})(document,{},plugin_platform());
