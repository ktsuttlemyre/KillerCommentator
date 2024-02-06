
							  
const berriesPerMap={
	day:66,
	night:54,
	dusk:66,
	twilight:60,
}
let end_win_screen=0
let berries = 0
let famineTimer;
let famineEnd = function(){
	
}

//https://kqhivemind.com/wiki/Stats_Socket_Events
_onGameEvent=window.onGameEvent


window.onGameEvent=function(event){
  _onGameEvent.call(window,event)
  console.log('handling event',event)
  
  let values = event.values
  switch(event.type){
    case 'gamestart':
        let [map,goldOnLeft,elapsedTime,attractMode,version] = values
        map.replace('map_','')
	obsstudio.setCurrentScene('KQSFL')
	berries = berriesPerMap[map]
	clearTimeout(end_win_screen)
	clearTimeout(famineTimer)
      break;
            
    //case: gameend:
    case 'gameend':
	current_scene='KQSFL 2' //event.winning_team+' wins'
	obsstudio.setCurrentScene('KQSFL 2')
	end_win_screen=setTimeout(function(){
		obsstudio.getCurrentScene(function(scene) {
			scene_changed=(current_scene==scene)
			if(scene_changed){return}
			obsstudio.setCurrentScene('KQSFL')
		})
	},5000)
	clearTimeout(famineTimer)

	obsstudio.setCurrentScene('KQSFL')
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
