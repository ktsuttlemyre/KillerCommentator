
							  
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

let timeouts={
	winScreen:{timer_id:0,scene:0}
}


obs_scene='KQSFL'
let setScene=function(scene,force){
	obsstudio.getCurrentScene(function(scene_now) {
		if(scene_now!=obs_scene && !force){
			return
		}else{
			obsstudio.setCurrentScene(scene)
			obs_scene=scene
		}
	})


	// clearTimeout(end_win_screen)
	// end_win_screen=setTimeout(function(){
	// 	obsstudio.getCurrentScene(function(scene) {
	// 		if(current_scene==scene){
	// 			obsstudio.setCurrentScene('KQSFL')
	// 		}
	// 	})
	// },5000)
}
setScene('KQSFL','force')

//https://kqhivemind.com/wiki/Stats_Socket_Events
_onGameEvent=window.onGameEvent

var url = new URL(location.href);
cabient_id=url.searchParams.get("cabient_id")||13
cabient_name=url.searchParams.get("cabient_name")||'glitch'
scene_name=url.searchParams.get("scene_name")||'sfl'

is_lobby=url.SearchParams.get("force_lobby")||''
is_lobby=is_lobby?'-Lobby':'';

window.onGameEvent=function(event){
  _onGameEvent.call(window,event)

  // console.log('handling event',event)

  switch(event.type){
    case 'gamestart':
	if(event.cabient_id!=cabient_id && event.cabient_name!=cabient_name && event.scene_name!=scene_name){ //ignore other scene events
	  return
	}
	setScene('KQSFL'+is_lobby)
      break;
    case 'gameend': 
	if(event.cabient_id!=cabient_id && event.cabient_name!=cabient_name && event.scene_name!=scene_name){ //ignore other scene events
	  return
	}
	setScene('KQSFL-Attn') //event.winning_team+' wins'
	clearTimeout(famineTimer)
    case 'berryDeposit':
      if(--berries<=0){
	//famine start
	famineTimer=setTimeout(famineEnd,90000)
      }
    break
	//unhandled event {"event_type":"mapstart","values":["map_day","True","0","False","17.26"],"uuid":"5f11afaa-1700-40ed-941c-39c834771a9f"}
     case 'mapstart':
	let map=event.values[0].replace('map_','')
	berries = berriesPerMap[map]
	clearTimeout(famineTimer)
     break
	  case 'playernames':
	  if(event.cabient_id!=cabient_id && event.cabient_name!=cabient_name && event.scene_name!=scene_name){ //ignore other scene events
	  	return
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
