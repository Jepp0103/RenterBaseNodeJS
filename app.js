//Creating the server
const express = require("express");
const app = express();
const messageServer = require("http").createServer(app);
const session = require("express-session"); //Session middleware
const socketio = require("socket.io");
const serverIo = socketio(messageServer);
const formatMessage = require("./public/rentChat/messages.js");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./public/rentChat/users");

//Middleware for passing jSON and form data in HTML-files
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Session 
const config = require("./config/config.json");
app.use(session({
    secret: config.sessionSecret, //Signing the session id - protecting the session data from being used by other users.
    resave: false, //Forces session to be saved back to session store.
    saveUninitialized: true
}));

//Knex and objection
const { Model } = require("objection");
const Knex = require("knex");
const knexfile = require("./knexfile.js");
const knex = Knex(knexfile.development); //Connection to database established.
Model.knex(knex);

//References to routers
const accountRouter = require("./routes/accountRouter.js");
app.use(accountRouter);

const authRouter = require("./routes/authRouter.js");
app.use(authRouter);

const itemRouter = require("./routes/itemRouter.js");
app.use(itemRouter);

const messageRouter = require("./routes/messageRouter.js")
app.use(messageRouter);

const rentChatRouter = require("./routes/rentChatRouter.js");
app.use(rentChatRouter);

const mailRoute = require("./routes/mailRouter.js");
app.use(mailRoute);

//Getting access to static files such as CSS, images, videos etc.
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/rentChat"));
app.use(express.static(__dirname + "/public/item"));
app.use(express.static(__dirname + "/public/navbar"));
app.use(express.static(__dirname + "/public/account"));

//Defining name of chat bot
const bot = "Renter Bot";

//Establishing socket connection everytime a client connects
serverIo.on("connection", socket => {
    socket.on("joinRoom", ({ username, room }) => { //Takes in object of username and room - waiting for clients
        //User who has joined the room
        const user = userJoin(socket.id, username, room); //Method from users.js - added to array of users.

        //User joining room
        socket.join(user.room);

        //Bot welcoming a current user
        socket.emit("message", formatMessage(bot, "Welcome to the chat!")); //Method from messages.js

        /*Emits to all other users than the connected user
        that a certain user has connected to the room - broadcast.*/
        socket.broadcast
            .to(user.room) //Using "to" in order to broadcast to a specific room for a given user.
            .emit(
                "message", 
                formatMessage(bot, `${user.username} has joined the chat`)
            );
        
        //Sending info about users and room
        serverIo.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room) //Send to all users in room in sidebar. Method from users.js
        });
    });

    //Listening for chat messages from clients
    socket.on("chatMessage", msg => {
        const user = getCurrentUser(socket.id);
        serverIo.to(user.room).emit("message", formatMessage(user.username, msg)); /*Sending message back to all clients connected in the room on 
                                                                                    "message" on the specific room with "to"*/
    });

    //When a client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id); //Using method userLeave in users.js. Finding user by the specific socket id and removing from the array of users.

        if (user) {
            serverIo.to(user.room).emit(
                "message", 
                formatMessage(bot, `${user.username} has left the chat`)
            );

            //Sending info about users and room
            serverIo.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room) //Method from users.js
            });
        }
    });
});

//Port 
const PORT = process.argv[2];

//Starting server
messageServer.listen(PORT, (error) => {
    if (error) {
        console.log("Error, server can't run.");
    }
    console.log("Server is running on port", messageServer.address().port);
});