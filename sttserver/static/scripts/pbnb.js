devices = ["kitchen light", "living room light", "portico light", "bedroom light", "children room light"];
commandtext = ["turn on", "turn off"];
commandtext_alt_1 = ["switch on", "switch off"];

commands = ["TURN_ON", "TURN_OFF"];

const channelName =  PUB_NUB_CHANNEL_KEY;

var pubnub = new PubNub({
    subscribeKey: PUB_NUB_SUBSCRIBE_KEY,
    publishKey:   PUB_NUB_PUBLISH_KEY,
    ssl: true
});

function prepcmd(stt_msg) {
  var  pub_msg = {type: "", command: "", device: ""};

  //console.log (stt_msg);
  stt_msg = stt_msg.toLowerCase();

  for (i = 0; i < commandtext.length; i++) {
    if ( (stt_msg.includes(commandtext[i])) || (stt_msg.includes(commandtext_alt_1[i]) )  ){
      console.log ("Sending command", commandtext[i]);
      pub_msg.command = commands[i];
      pub_msg.type = "control";
      break;
    }
  }

  for (i = 0; i < devices.length; i++) {
    if (stt_msg.includes(devices[i])) {
      console.log ("Device: " + devices[i]);
      pub_msg.device = devices[i];
      break;
    }
  }

  return pub_msg;
};

function pub_subscribe(){
  console.log("Subscribing to " + channelName);
  pubnub.addListener({
      message: function(m) {
          //console.log (m.message);
          msg = m.message.cmd;
          if (msg.Type == 'status') {
            console.log(msg.device + " " + msg.status);
            if (document.querySelector('#statusBox').value == "") {
              document.querySelector('#statusBox').value = msg.device + " " + msg.status;
              }
            else {
              document.querySelector('#statusBox').value = document.querySelector('#statusBox').value + "\n" + msg.device + " " + msg.status;
              }
          }
      }
  });

  pubnub.subscribe({
      channels: [channelName],
  });
};

function pubmsg (stt_msg) {

  var pub_msg = prepcmd (stt_msg);
  pubnub.publish(
        {
            message: {
                cmd: pub_msg
            },
            channel: channelName,
            sendByPost: false, // true to send via post
            storeInHistory: false //override default storage options
        },
        function (status, response) {
            // handle status, response
        }
    );
};

$(document).ready(function () {
	// Starts subscribing to response channel
	pub_subscribe();
  console.log ("Init done");
});
