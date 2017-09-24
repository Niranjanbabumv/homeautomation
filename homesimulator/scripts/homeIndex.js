/************************************************************************
	Voice based smart home control
*************************************************************************/
var devices = ["kitchen light", "living room light", "portico light", "bedroom light", "children room light"];
var bulbs = ['#kitchenbulb', '#livingroombulb', '#livingroombulb', '#bedroombulb', '#porticobulb'];

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

function pubmsg (status_msg) {
  console.log ("Publishing back from home");
  pubnub.publish(
        {
            message: {
                cmd: status_msg
            },
            channel: channelName,
            sendByPost: false, // true to send via post
            storeInHistory: false, //override default storage options
        },
        function (status, response) {
            // handle status, response
        }
    );
}

/************************************************************************
	FUNCTION NAME : home_control()
    DESCRIPTION   : Turn's On/Off the bulb in the home according to
     command (on/off) and device
*************************************************************************/
function home_control(m){
  //console.log (m);
  msg = m.cmd;
  var status_msg = {Type: "status", device: "", status: ""};
  console.log (msg);

  if(msg.type == "control") {

    for (i = 0; i < devices.length; i++) {
      if (msg.device == devices[i]) {
        status_msg.device = msg.device;

        if (msg.command == "TURN_ON") {
          $(bulbs[i]).css({ fill: "#FFDB55" });
          status_msg.status = "turned on";
          pubmsg (status_msg);
        }
        else if (msg.command == "TURN_OFF") {
          $(bulbs[i]).css({ fill: "#000000" });
          status_msg.status = "turned off";
          pubmsg (status_msg);
        }
      }
    }
	}
  else if(msg.Type == "status") {
    console.log("Status message");
    console.log (msg.device + " " + msg.status)
	}
  else {
		console.log("Invalid message: " + msg.message);
		//console.log("Received message from block : ",m);
	}
};


$(document).ready(function () {
	// Starts subscribing to response channel
	pub_subscribe();
  console.log ("Init done");
});
