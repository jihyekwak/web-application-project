require("dotenv").config();

/* ==== External Modules ==== */
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const morgan = require('morgan');

/* ==== Internal Modules ==== */
const routes = require("./routes");

/* ==== Instanced Modules  ==== */
const app = express();

/* ====  Configuration  ==== */
const PORT = process.env.PORT || 3000;

// passport
require("./config/passport");
// connect to the MongoDB with mongoose
require("./config/database");

app.set("view engine", "ejs");

/* ====  Middleware  ==== */
app.use(morgan('dev'));
// body data middleware
app.use(express.urlencoded({ extended: true }));
// method override middleware
app.use(methodOverride("_method"));
// serve public files
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
// logger
app.use((req, res, next) => {
	console.log(req.url, req.method);
	next();
});

app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: true,
	})
	);

app.use(passport.initialize());
app.use(passport.session());

/* ====  Routes & Controllers  ==== */
//Home Route
app.get("/", (req, res) => {
	res.render("index");
});

//404 Route
app.get((req, res) => {
	res.send("404! Error! Page not found :(");
});

//Internal Routes
app.use("/users", routes.users);
app.use("/posts", routes.posts);
app.use("/", routes.comments);
app.use("/", routes.oauth);
app.use("/", routes.tags);

/* ====  Server Listener  ==== */
app.listen(process.env.PORT || 3000, () => {
	console.log(`Project2 app is live at http://localhost:${PORT}`);
});
