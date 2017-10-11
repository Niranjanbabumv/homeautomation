/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* eslint-env node, es6 */

const express = require('express');
const app = express();
const watson = require('watson-developer-cloud');

// allows environment properties to be set in a file named .env
require('dotenv').load({ silent: true });

app.use(express.static(__dirname + '/static'));


// token endpoints
// **Warning**: these endpoints should probably be guarded with additional authentication & authorization for production use

// speech to text token endpoint
var sttAuthService = new watson.AuthorizationV1(
  Object.assign(
    {
      username: process.env.SPEECH_TO_TEXT_USERNAME, // or hard-code credentials here
      password: process.env.SPEECH_TO_TEXT_PASSWORD
    }
  )
);

app.use('/api/speech-to-text/token', function(req, res) {
  sttAuthService.getToken(
    {
      url: watson.SpeechToTextV1.URL
    },
    function(err, token) {
      if (err) {
        console.log('Error retrieving token: ', err);
        res.status(500).send('Error retrieving token');
        return;
      }
      res.send(token);
    }
  );
});


const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Voice Controlled Home Automation Demo.. Server is live at http://localhost:%s/', port);
});

// Chrome requires https to access the user's microphone unless it's a localhost url so
// this sets up a basic server on port 3001 using an included self-signed certificate
// note: this is not suitable for production use
// however bluemix automatically adds https support at https://<myapp>.mybluemix.net
// You need to have the ssl certificates in place.
/*
if (!process.env.VCAP_SERVICES) {
  const fs = require('fs');
  const https = require('https');
  const HTTPS_PORT = 3001;

  const options = {
    key: fs.readFileSync(__dirname + '/keys/localhost.pem'),
    cert: fs.readFileSync(__dirname + '/keys/localhost.cert')
  };
  https.createServer(options, app).listen(HTTPS_PORT, function() {
    console.log('Secure server live at https://localhost:%s/', HTTPS_PORT);
  });
}
*/
