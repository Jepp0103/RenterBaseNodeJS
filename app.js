//Creating the server
const express = require("express");
const app = express();
const messageServer = require("http").createServer(app);
const session = require("express-session"); //Session middleware
const io = require("socket.io")(messageServer);

//Port 
const port = process.argv[2];

//jSON and form data in HTML-files
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Session
const config = require("./config/config.json");
app.use(session({
    secret: config.sessionSecret, //'secret value'
    resave: false,
    saveUninitialized: true
}));

//Knex and objection
const { Model } = require("objection");
const Knex = require("knex");
const knexfile = require("./knexfile.js");
const knex = Knex(knexfile.development); //Connection to database established.
Model.knex(knex);