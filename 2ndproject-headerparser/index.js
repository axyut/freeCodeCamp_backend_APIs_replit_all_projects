// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.use((req, res, next) => {
    
   var ip = req.ip;
	var lang = req.headers["accept-language"] ; 
	console.log(ip,lang);
	next()
})

// your first API endpoint...
app.get('/api/whoami', function(req, res,next) {
	next(); 
}, function(req,res){
	 var ip = req.ip;
	var lang = req.headers["accept-language"] ; 
	var soft = req.headers['user-agent'];
	res.json({ ipaddress:ip, language: lang, software: soft });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});
