devices = ["kitchen", "living room", "portico", "bedroom", "children room"];
commandtext = ["turn on", "turn off"];
commandtext_alt_1 = ["switch on", "switch off"];

commands = ["TURN_ON", "TURN_OFF"];

/*
PUB_NUB_PUBLISH_KEY='pub-c-c504d6fa-d3fe-48ad-b716-24f94c33d987'
PUB_NUB_SUBSCRIBE_KEY='sub-c-fbde73de-6512-11e6-ac7d-02ee2ddab7fe'
PUB_NUB_CHANNEL_KEY='stt_channel'
*/

const channelName =  PUB_NUB_CHANNEL_KEY;

var pubnub = new PubNub({
    subscribeKey: PUB_NUB_SUBSCRIBE_KEY,
    publishKey:   PUB_NUB_PUBLISH_KEY,
    ssl: true
});

function prepcmd(stt_msg) {
  var  pub_msg = {type: "", command: "", device: ""};

  console.log (stt_msg);
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
}

function pubmsg (stt_msg) {

  var pub_msg = prepcmd (stt_msg);
  pubnub.publish(
        {
            message: {
                cmd: pub_msg
            },
            channel: channelName,
            sendByPost: false, // true to send via post
            storeInHistory: false, //override default storage options
            meta: {
                "cool": "meta"
            } // publish extra meta with the request
        },
        function (status, response) {
            // handle status, response
        }
    );
}
