require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');
const isUrl = require("is-url");
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));



let counter = 0;
const shortened_url = {};


app.get('/', function(req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

app.post("/api/shorturl", (req, res) => {
	og = req.body.url;
	if (isUrl(og)) {
		//randomNum(og.length, usedNums);
		counter += 1;

		shortened_url[counter] = og;
		console.log(shortened_url);

		res.json({ original_url: og, short_url: counter });
		
	} else {
		res.json({ error: "invalid url" });
	}

})

app.get("/api/shorturl/:id", function(req, res) {
	let id = req.params.id;
	let url = shortened_url[id];
	console.log(url);
	res.redirect(url);
})

app.listen(port, function() {
	console.log(`Listening on port ${port}`);
});
