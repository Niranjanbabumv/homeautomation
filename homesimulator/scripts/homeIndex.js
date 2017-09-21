/************************************************************************
	Voice based smart home control
*************************************************************************/
var devices = ["kitchen", "living room", "portico", "bedroom", "children room"];
var commands = ["turn on", "turn off"];

const channelName =  PUB_NUB_CHANNEL_KEY;

var pubnub = new PubNub({
  subscribeKey: PUB_NUB_SUBSCRIBE_KEY,
  publishKey:   PUB_NUB_PUBLISH_KEY,
  ssl: true
});

/************************************************************************
	FUNCTION NAME : pub_subscribe()
  DESCRIPTION   : Subscribes to the control channel
*************************************************************************/
function pub_subscribe(){

  pubnub.addListener({
      message: function(m) {
          //console.log (m.message);
          home_control (m.message);
      }
  });

  pubnub.subscribe({
      channels: [channelName],
  });
};

/************************************************************************
	FUNCTION NAME : home_control()
    DESCRIPTION   : Turn's On/Off the bulb in the home according to
     command (on/off) and device
*************************************************************************/
function home_control(m){
  //console.log (m);
  msg = m.cmd;

  console.log (msg);

  if(msg.type == "control") {

		if(msg.device == "kitchen") {
			if (msg.command == "TURN_ON") {
				$('#kitchenbulb').css({ fill: "#FFDB55" });
			}
			else if (msg.command == "TURN_OFF") {
				$('#kitchenbulb').css({ fill: "#000000" });
			}
    }
    else if (msg.device == "living room") {
			if (msg.command == "TURN_ON"){
				$('#livingroombulb').css({ fill: "#FFDB55" });
			}
      else if (msg.command == "TURN_OFF") {
				$('#livingroombulb').css({ fill: "#000000" });
			}
		}
    else if(msg.device == "bedroom") {
			if(msg.command == "TURN_ON") {
				$('#bedroombulb').css({ fill: "#FFDB55" });
			}
      else if (msg.command == "TURN_OFF") {
				$('#bedroombulb').css({ fill: "#000000" });
			}
		}
    else if(msg.device == "children room"){
			if (msg.command == "TURN_ON") {
				$('#childrenroombulb').css({ fill: "#FFDB55" });
			}
      else if (msg.command == "TURN_OFF") {
				$('#childrenroombulb').css({ fill: "#000000" });
			}
		}
    else if(msg.device == "portico"){
			if(msg.command == "TURN_ON") {
				$('#porticobulb').css({ fill: "#FFDB55" });
			}
      else if (msg.command == "TURN_OFF") {
				$('#porticobulb').css({ fill: "#000000" });
			}
		}
	}
  else if(msg.Type == "monitor") {
    console.log("Monitor message");
	}
  else {
		console.log("Invalid message");
		//console.log("Received message from block : ",m);
	}
};


$(document).ready(function () {
	// Starts subscribing to response channel
	pub_subscribe();
  console.log ("Init done");
});
