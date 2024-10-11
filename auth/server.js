const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true}));

app.get('/log', function (req, res) {
  let message = req.query.message;
  console.log(message);
});

app.get('/getstreamurls', function (req, res) {
  let name = req.query.name;
  let streamArray=[];
  const fs = require('fs');

  /*Uncomment the following line to display request data send to this route via GET in logs*/
  // console.log(req.query);

  // Load auth.json
  let authData = fs.readFileSync('auth.json');
  let authJSON = JSON.parse(authData);

  console.log(`User ${name} requested stream URLs to start or stop a push service...`);
  let arr = authJSON['stream'];
  for (var i=0; i<arr.length; i++) {
  	if (arr[i].name == name) {
		streamArray.push(arr[i].url)
	}
  }
 const streamURLS = streamArray.join(' ');
 // Check if streamURLS exists and output some log info
 if (streamURLS!='') {
 	console.log(`User ${name} has the following push-target URLs: ${streamURLS}`);
 }
 else { 
	console.log(`User ${name}'s stream has no push-target URLs`); 
 }

  res.send(streamURLS);
});


app.post("/auth", function (req, res) {
  let authkey = req.body.key;
  let streamname = req.body.name;
  let call = req.body.call;
  const fs = require('fs');

  /* Uncomment the line below to display all request data sent to this route via POST in logs */
  // console.log(req.body);

  /* No stream name provided, not allowed. Return 403 */
  if (streamname.length === 0) {
	console.log("Empty Stream Name provided, aborting...");
  	res.status(403).send();
	return;
  }

  /* Always allow local */
  if (req.body.addr.startsWith("unix:/")) {
	res.status(200).send();
	return;
  }

  //Set stream key to empty string for authentification purpose, if it was undefined
  //This allows publish or playback with no authkey provided and just a username (not recommended!)
  //If you REALLY want this, provide an empty "key" string in auth.json for that username (still, really not recommended!) 
  if (typeof authkey == 'undefined') {
          authkey = "";
  }

  // Load auth.json
  let authData = fs.readFileSync('auth.json');
  let authJSON = JSON.parse(authData);
  // Check for correct call, has to exist in auth.json data
  if (authJSON.hasOwnProperty(call)) {
	// Iterate over auth data for that call
	let arr = authJSON[call];
	for (var i=0; i<arr.length; i++) {
	  if (arr[i].name == streamname && arr[i].key == authkey) {
	  	console.log(`Auth successful for User ${arr[i].name} on ${call}`);
		res.status(200).send();
		return;
	  }
	}

  }

  /* It seems auth Failed, reject the stream */
  console.log(`Authenfication failed for User ${streamname} with Key ${authkey}`);
  res.status(403).send();
});

app.listen(8000, function () {
  console.log("RTMP Authentication Server started.");
});
