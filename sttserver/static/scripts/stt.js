
function stt () {
  finalData = "";
  fetch('/api/speech-to-text/token')
    .then(function(response) {
      return response.text();
    }).then(function (token) {
      console.log ("Starting STT");
      var stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
        token: token,
        outputElement: '#Command_Text', // CSS selector or DOM Element
        //outputElement: finalData,
        keywords: ["turn on", "turnon", "switchon", "switch on", "switch", "turn", "on", "off", "kitchen", "light", "door", "garage", "AC", "hall", "drawing room"],
        keywords_threshold: 0.3,
        inactivity_timeout: 10
        //interim_results: false
      });

      stream.on('data', function(data) {
        if(data.results[0] && data.results[0].final) {
          stream.stop();
          finalData = document.querySelector('#Command_Text').innerHTML;

          //finalData = "Turn Off " + finalData;
          //finalData = finalData + "Kitchen Light";

          console.log (finalData);
          console.log('stop listening.');
          pubmsg(finalData);

        }
      });

      stream.on('error', function(err) {
        console.log(err);
      });

    }).catch(function(error) {
      console.log(error);
    });
};
