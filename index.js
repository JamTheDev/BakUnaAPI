// .env requirement
require("dotenv").config()
// modules
const express = require("express");
const mongoose = require("mongoose");
const parser = require("body-parser");

// express class
const app = express();

// set ejs view engine, for docs
app.set('view engine', 'ejs');

// connect to db
mongoose.connect(process.env['DB_URL'], {useNewUrlParser: true})
const db = mongoose.connection;

db.once('open', () => {
  // Check if connected to database.
    console.log("Connected.");
})

db.on('start', () => {
  // Prompts when code is about to start connection to mongodb
    console.log("Starting Connection...");
})

// parser
app.use(parser.json());

// routers
const UserRouter = require("./routes/Users");
const BranchRouter = require("./routes/BranchHandler");
const AuthRouter = require("./routes/Authenticator");

// endpoints
app.use("/api/Users", UserRouter);
app.use("/api/branch", BranchRouter);
app.use("/api/auth", AuthRouter);

// main documentation page
app.get("/", (req, res) => {
  res.render("pages/main")
});

// listener
app.listen(3000);