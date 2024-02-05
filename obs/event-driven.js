
							  
const berriesPerMap={
	day:66,
	night:54,
	dusk:66,
	twilight:60,
}
let berries = 0
let famineTimer;
let famineEnd = function(){
	
}
_onGameEvent=window.onGameEvent

window.onGameEvent=function(event){
  _onGameEvent.call(window,event)
  console.log('handling event',event)
  
  let values = event.values
  switch(event.event_type){
    case 'gamestart':
        let [map,goldOnLeft,elapsedTime,attractMode,version] = values
        map.replace('map_','')
	obsstudio.setCurrentScene('KQSFL')
	berries = berriesPerMap[map]
      break;
            
    //case: gameend:
    case 'victory':
      const [victor,type] = values
        obsstudio.setCurrentScene('KQSFL 2')
	clearTimeout(famineTimer)

    case 'berryDeposit':
      if(--berries<=0){
	//famine start
	famineTimer=setTimeout(famineEnd,90000)
      }
    break
    case 'berryKickIn':
      if(berries<=0){
	//famine start
	famineTimer=setTimeout(famineEnd,90000)
      }
      break
      default:
        console.log('unhandled event',event)
  }
}
