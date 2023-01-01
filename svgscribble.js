appendTo('head',inject('link',{href:"style.css", rel:"stylesheet", type:"text/css", crossorigin:"anonymous"}))
appendTo(document.body,inject('script',{src:"https://kit.fontawesome.com/48764efa36.js", crossorigin:"anonymous"},function(){
	  // remote script has loaded
      }));


SVGScribble={}
SVGScribble.clear=function(){
	(document.querySelectorAll(".drawing-el")||[]).forEach(function (elem) {elem.remove()});
}
SVGScribble.hide=function(){
		document.body.setAttribute('data-drawing', false);
		config.drawing = false;
}
SVGScribble.show=function(){
		document.body.setAttribute('data-drawing', true);
		config.drawing = true;
}
SVGScribble.state=false;
SVGScribble.init=function(){
	window.SVGScribble.toggle=function(){
		// Set the body attribute 'data-drawing' to true or false, based on if the user clicks the 'Start Drawing' button
		// Also sets config.drawing to true or false.
		let drawing = config.drawing;
		config.drawing = !drawing;
		document.body.setAttribute('data-drawing', !drawing)
	}
	var pointAttrs='pageX,pageY,timeStamp,pointerId'.split(',')
	setPoint=function(e){
		if(!paths[e.pointerId]){return}
		let obj={}
		for(var i=0,l=pointAttrs.length;i<l;i++){
			obj[pointAttrs[i]]=e[pointAttrs[i]]
		}
		paths[e.pointerId].push(obj)
		events[e.pointerId].push(e)
	}
	
	SVGScribble.state='initializing'
	// Ensure drawing layer is at root
	var drawing_layer = document.createElement('div')
	drawing_layer.id="drawing-layer"
	document.body.appendChild(drawing_layer);
	var drawing_cover = document.createElement('div')
	drawing_cover.id="drawing-cover"
	document.body.appendChild(drawing_cover);

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
		drawing: false,         // Set to true if we are drawing, false if we aren't
		tool: 'commentator',       // The currently selected tool
		color : 'white',        // The currently selected colour
		colorAlt : 'black',
		strokeWidth: 4,         // The width of the lines we draw
		configNormalisation: 12,// The average normalisation for pencil drawing
		pointerTypes: {
			mouse:0,
			pen:1,
			touch:1,
		}
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
	// Along with cofig.drawing to false.
	document.querySelector('#drawing-box .close').addEventListener('mousedown', function(e) {
		SVGScribble.hide()
	})
	document.querySelector('#drawing-box .trash').addEventListener('pointerdown', function(e) {
		e.target.releasePointerCapture(e.pointerId);
		SVGScribble.clear();
	})

	document.body.addEventListener('pointerdown', function(e) {
		if(!e.isTrusted || config.drawing == false){return}
		if(!config.pointerTypes[e.pointerType]){ return }
		
		//filters out other div layers we dont want to draw on due to event bubbling 
// 		if(helper.parent(e.target, '#drawing-box', 1) !== null && helper.parent(e.target, '#drawing-box', 1).matches('#drawing-box')) {
// 			return false;
// 		}
		console.log("pointer down on draw layer",e.pageX,e.pageY,e.target,e)
		// Generate id for each element
		let id = helper.generateId();
		
		events[e.pointerId]=[]
		paths[e.pointerId]=[]
		setPoint(e);
		
		if(config.tool == 'arrow' || config.tool=='commentator') {
			if(arrow.startX==null ){
			
			}
			arrow={// startX, startY, and stopX, stopY store information on the arrows top and bottom ends
				startX: null,
				startY: null,
				stopX: null,      
				stopY: null,          
				activeDirection: 'se',                    // This is the current direction of the arrow, i.e. south-east
				arrowClasses: [ 'nw', 'ne', 'sw', 'se' ], // These are possible arrow directions
				lineAngle: 0,                             // This is the angle the arrow point at about the starting point
				domElem:null,
				pathElems:null,
				svgElem:null,
				pointerIds:[],
			}
			// Set arrow start point
			arrow.startX = e.pageX;
			arrow.startY = e.pageY;

			// Add element to drawing layer
			var wrapper= document.createElement('div');
			wrapper.innerHTML= svgEl.arrowPath(  [ arrow.startX + window.scrollX, arrow.startY + window.scrollY ], [  e.pageX, e.pageX ], `M0 0 L0 0`, 'arrow-item', arrow.arrowClasses[3], [ 0, 0 ], 0, [ 0, 0, 0 ], id );
			wrapper.firstChild.classList.add('current-item');
			wrapper.firstChild.classList.add(`pointerId-${e.pointerId}`);
			
			drawing_layer.appendChild(wrapper.firstChild);
			
			arrow.pathElems=document.querySelector(`#drawing-layer .arrow.current-item.pointerId-${e.pointerId} path.arrow-line`);
			arrow.domElem=document.querySelector(`#drawing-layer .arrow.current-item.pointerId-${e.pointerId}`);
			arrow.svgElem=document.querySelector(`#drawing-layer .arrow.current-item.pointerId-${e.pointerId} svg`);
			arrow.pointerIds.push(e.pointerId)
		}
		if(config.tool == 'freeHand' || config.tool=='commentator') {

			freeHand[e.pointerId]={
				currentPathText: `M${window.scrollX} ${window.scrollY} `,      // This is the current path of the pencil line, in text
				startX: e.pageX,                       // The starting X coordinate
				startY: e.pageY,                       // The starting Y coordinate
				lastMousePoints: [[ window.scrollX, window.scrollY ]],   // This is the current path of the pencil line, in array
				domElem:null,
				pathElems:null,
			}
			
			
			// Add element to the drawing layer
			var wrapper= document.createElement('div');
			wrapper.innerHTML=svgEl.drawPath( [ e.pageX, e.pageY ], [ e.pageX, e.pageY ], ``, id);
			wrapper.firstChild.classList.add('current-item')
			wrapper.firstChild.classList.add(`pointerId-${e.pointerId}`)
			
			drawing_layer.appendChild(wrapper.firstChild);
			freeHand[e.pointerId].pathElems=document.querySelectorAll(`#drawing-layer .free-hand.current-item.pointerId-${e.pointerId} svg path`);
			freeHand[e.pointerId].domElem=document.querySelector(`#drawing-layer .free-hand.current-item.pointerId-${e.pointerId}`);
		} 
		else if(config.tool == 'eraser') {
			// Check if user has clicked on an svg
			console.log('eraser clicked ',e.target,e)
			if(helper.parent(e.target, '.drawing-el', 1) !== null && helper.parent(e.target, '.drawing-el', 1).matches('.drawing-el')) {
				// If they have, delete it
				helper.parent(e.target, '.drawing-el', 1).remove();
			}
		}
	})

	document.body.addEventListener('pointermove', function(e) {
		if(!e.isTrusted || config.drawing == false){return}
		if(!config.pointerTypes[e.pointerType]){ return }
		
		//filters out other div layers we dont want to draw on due to event bubbling 
// 		if(helper.parent(e.target, '#drawing-box', 1) !== null && helper.parent(e.target, '#drawing-box', 1).matches('#drawing-box')) {
// 			return false;
// 		}
		
		console.log('pointermove on draw layer',e.pageX,e.pageY,e.target,e)
		
		setPoint(e)

		// Assuming there is a current item to in the drawing layer
		if(document.querySelector('#drawing-layer .current-item') !== null) { 
			// If we are using the arrow tool
			if(config.tool == 'arrow' || config.tool=='commentator') {
				// Then get the original start position
				let startX = arrow.startX;
				let startY = arrow.startY;
				// Set a default angle of 90
				let angleStart = 90;
				
				// And a default direction of 'south east'
				let arrowClass = arrow.arrowClasses[3];
				// Calculate how far the user has moved their mouse from the original position
				let endX = e.pageX - startX - window.scrollX;
				let endY = e.pageY - startY - window.scrollY;

				// And using that info, calculate the arrow's angle
				helper.calculateArrowLineAngle(endX, endY);
				// Then update the config to this new end position
				arrow.stopX = endX;
				arrow.stopY = endY;
				
				// And update the HTML to show the new arrow to the user
				//todo update this to be cached instead of dom queried like freeHand.pathElems
				arrow.domElem.classList.remove('static');
				arrow.domElem.setAttribute('data-direction', arrow.activeDirection);
				arrow.svgElem.setAttribute('viewbox', `0 ${endX} 0 ${endY}`);
				arrow.pathElems.forEach(function(path){
					path.setAttribute('d', `M0 0 L${endX} ${endY}`);
				})
			}
			
			if(config.tool == 'freeHand' || config.tool=='commentator') {
				// Similar to arrows, calculate the user's end position
				let endX = e.pageX - freeHand[e.pointerId].startX;
				let endY = e.pageY - freeHand[e.pointerId].startY;
				
				// And push these new coordinates to our config
				let newCoordinates = [ endX, endY ];
				freeHand[e.pointerId].lastMousePoints.push([endX, endY]);
				if(freeHand[e.pointerId].lastMousePoints.length >= config.configNormalisation) {
					freeHand[e.pointerId].lastMousePoints.shift();
				}
				
				// Then calculate the average points to display a line to the user
				let avgPoint = helper.getAveragePoint(0,e);
				if (avgPoint) {
					freeHand[e.pointerId].currentPathText += " L" + avgPoint.x + " " + avgPoint.y;

					let tmpPath = '';
					for (let offset = 2; offset < freeHand[e.pointerId].lastMousePoints.length; offset += 2) {
						avgPoint = helper.getAveragePoint(offset,e);
						tmpPath += " L" + avgPoint.x + " " + avgPoint.y;
					}

					// Set the complete current path coordinates
					freeHand[e.pointerId].domElem.classList.remove('static');
					freeHand[e.pointerId].pathElems.forEach(function(path){path.setAttribute('d', freeHand[e.pointerId].currentPathText + tmpPath)});
				}

			}
		}
			
	});

	// Whenever the user leaves the page with their mouse or lifts up their cursor
	[ 'mouseleave', 'pointerup' ].forEach(function(item) {
		document.body.addEventListener(item, function(e) {
			if(!e.isTrusted){return}
			//purposely dont check for drawing state in case it changed mid line draw
			//if(config.drawing == false){return}
			if(e.type == 'pointerup' && !config.pointerTypes[e.pointerType]){ return }
			
			//filters out other div layers we dont want to draw on due to event bubbling 
			// 		if(helper.parent(e.target, '#drawing-box', 1) !== null && helper.parent(e.target, '#drawing-box', 1).matches('#drawing-box')) {
			// 			return false;
			// 		}

			console.log('pointerup/mouseleave",e.pageX,e.pageY,e.target,e')

			setPoint(e)
			
			// Remove current-item class from all elements, and give all SVG elements pointer-events
			document.querySelectorAll('#drawing-layer > div').forEach(function(item) {
				item.style.pointerEvent = 'all';
				if(item.classList.contains(`pointerId-${e.pointerId}`)){
					//should this be perminant or fade away
					if (!e.shiftKey && !e.ctrlKey) { //|| e.altKey 
						//make ephemerial
						item.classList.add('ephemeral');
						!(function(id){
							setTimeout(function(){
								let elem=document.getElementById(id);
								elem.parentElement.removeChild(elem);
							},10000)
						})(item.id)
					}
					item.classList.remove('current-item');
					item.classList.remove(`pointerId-${e.pointerId}`);
				}
				// Delete any 'static' elements
				if(item.classList.contains('static')) {
					item.remove();
				}
			});
			
			// Reset freeHand variables where needed
			delete freeHand[e.pointerId]
			//this is where you would send the path to the server
			delete paths[e.pointerId]
			
		});
	});


	let helper = {
		// This averages out a certain number of mouse movements for free hand drawing
		// To give our lines a smoother effect
		getAveragePoint: function(offset,e) {
			let len = freeHand[e.pointerId].lastMousePoints.length;
			if (len % 2 === 1 || len >= 4) {
				let totalX = 0;
				let totalY = 0;
				let pt, i;
				let count = 0;
				for (i = offset; i < len; i++) {
					count++;
					pt = freeHand[e.pointerId].lastMousePoints[i];
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
			for (var p = el && el.parentElement; p; p = p.parentElement) {
				result.push(p);
				if(p.matches(match)) {
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
			config.drawing = false;
		}else if(e.key === "Backspace" || e.key === "Delete" || e.key === "Clear" || e.key === "D" || e.key === "d"){
			 SVGScribble.clear()
	}});
	SVGScribble.state='init'
}
