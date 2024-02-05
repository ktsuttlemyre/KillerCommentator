
							  
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
window.onGameEvent=function(event){
  console.debug('handling event',event)
  
  let values = event.values
  switch(event.event_type){
    case gamestart:
        let [map,goldOnLeft,elapsedTime,attractMode,version] = values
        map.replace('map_','')
	SourceManager.setLayout('home')
	SourceManager.setAugment(map)
	berries = berriesPerMap[map]
      break;
            
    //case: gameend:
    case victory:
      const [victor,type] = values
        SourceManager.setLayout(victor.toLowerCase())
	SourceManager.setAugment()
	clearTimeout(famineTimer)

    case berryDeposit:
      if(--berries<=0){
	//famine start
	famineTimer=setTimeout(famineEnd,90000)
      }
    break
    case berryKickIn:
      if(berries<=0){
	//famine start
	famineTimer=setTimeout(famineEnd,90000)
      }
      break
      default:
        console.debug('unhandled event',event)
  }
}
