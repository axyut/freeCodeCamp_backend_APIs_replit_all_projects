const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.set("strictQuery", false);
mongoose
	.connect(process.env.REMOTE_MONGO, { useNewUrlParser: true })
	.then(() => console.log("Connected!"));

const usersSchema = new mongoose.Schema({
	username: String,
	count: Number,
	log: [
		{
			date: {
				type: String,
			},
			duration: Number,
			description: String,
		},
	],
});

const NewUsers = mongoose.model("NewUsers", usersSchema);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users/", async (req, res) => {
	var username = req.body.username;
	const userExist = await NewUsers.findOne({ username });
	if (userExist) {
		return res.status(422).json({
			message: "You're already registered. Please use Id",
			_id: userExist.id,
		});
	}
	const user = new NewUsers({
		username,
	});
	const done = await user.save();
	if (done) {
		console.log("User saved.");
	} else {
		throw new Error();
	}
	const createdUser = await NewUsers.find({ username }).select({ _id: 1 });
	var [{ _id }] = createdUser;
	return res.status(200).json({ username, _id });
});

app.get("/api/users/", async (req, res) => {
	const foundUsers = await NewUsers.find({}).select({ username: 1 });
	res.send(foundUsers);
});

app.post("/api/users/:_id/exercises/", async (req, res) => {
	var _id = req.params._id;
	var { description, duration, date } = req.body;
	duration = Number(duration);
	if (!date) {
		date = new Date().toDateString();
	} else {
		date = new Date(date).toDateString();
	}

	if (_id.length === 24) {
		const userExist = await NewUsers.findById(_id);

		if (userExist) {
			const exercise = {
				date,
				duration,
				description,
			};
			const updatedUser = await NewUsers.findByIdAndUpdate(
				{ _id },
				{ $push: { log: exercise } }
			);

			const logLength = updatedUser.log.length + 1;
			const updateCount = await NewUsers.findByIdAndUpdate(
				{ _id },
				{ count: logLength }
			);

			res.json({
				_id,
				username: updatedUser.username,
				date,
				duration,
				description,
			});
		} else {
			return res.status(422).json({
				message: "You're not registered, please create username",
			});
		}
	} else {
		res.status(422).json({ message: "Please provide valid id!" });
	}
});

app.get("/api/users/:_id/logs", async (req, res) => {
	const userId = req.params._id;
	var { from, to, limit } = req.query;
	const user = await NewUsers.findById(userId).select({ __v: 0 });

	if (from || to || limit) {
		const logs = user.log;
		const filteredLogs = logs.filter((log) => {
			const formattedLogDate = new Date(log.date)
				.toISOString()
				.split("T")[0];
			return true;
		});
		const slicedLogs = limit ? filteredLogs.slice(0, limit) : filteredLogs;
		user.log = slicedLogs;
	} else {
		res.json(user);
	}
});

app.get("/del", (req, res) => {
	NewUsers.deleteMany({}).then(() => {
		console.log("deleted successfully");
		res.send("deleted successfully");
	});
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
