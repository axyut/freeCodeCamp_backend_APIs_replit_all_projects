// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var moment = require("moment");
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:date", function(req, res) {
	var date = (req.params.date);
  var unix,utc;

	if ((new Date(parseInt(date))).toString() === "Invalid Date") {
    res.json({ error: "Invalid Date" });
		return;
  }
  
  if ((new Date(parseInt(date))).getTime() === parseInt(date) && date.indexOf("-") === -1 && date.indexOf(" ") === -1){
		unix = parseInt(date);
		utc=  new Date(parseInt(date)).toUTCString();

	} else {
				unix =  new Date(date).getTime();
		utc = new Date(parseInt(unix)).toUTCString();
	}

 
  
  res.json({ unix, utc });
});

app.get("/api/", function(res,res){
	var utc = (new Date()).toUTCString();
		var unix = (new Date()).getTime();
			res.json({ unix: unix, utc: utc });
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});
