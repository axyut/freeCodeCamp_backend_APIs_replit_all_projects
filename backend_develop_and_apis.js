let express = require('express');
let app = express();
let bodyParser = require('body-parser');

//app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use("/public", express.static(__dirname + "/public"));
app.use(function (req, res, next) {
	console.log(req.method + " " + req.path + " - " + req.ip);
	next();
})
rootFile = __dirname +"/views/index.html";

app.get("/", function(req,res){
	res.sendFile(rootFile);
});

app.get("/now", function (req,res,next) {

	req.time = new Date().toString();
	next();
}, function(req,res){
	res.json({"time":req.time});
});

app.get("/json", function (req,res) {
	if (process.env.MESSAGE_STYLE === "uppercase") {
		res.json({"message":"HELLO JSON"});
	}else{
			res.json({"message":"Hello json"});
	}
	
});

app.get("/:word/echo", function(req,res){
	echoed_word= req.params.word;
	res.json({"echo":echoed_word});
})

app.get("/name" ,function(req,res){
	firstname = req.query.first;
	lastname = req.query.last;
	res.json({"name": `${firstname} ${lastname}`});
})

app.post("/name", function(req,res){
	

	res.json({"name":`${req.body.first} ${ req.body.last}`})
})



















 module.exports = app;
