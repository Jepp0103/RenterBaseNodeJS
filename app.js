//Creating the server
const express = require("express");
const app = express();
const messageServer = require("http").createServer(app);
const session = require("express-session"); //Session middleware
const socketio = require("socket.io");
const io = socketio(messageServer);
const formatMessage = require("./utils/messages.js");

//Port 
const PORT = process.argv[2];

//jSON and form data in HTML-files
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Session
const config = require("./config/config.json");
app.use(session({
    secret: config.sessionSecret, //Signing the session id cookie - either a string for one secret or an array for multiple
    resave: false, //Only necessary if implementing touch method - forces session to be saved back to session store.
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

const rentChatRouter = require("./routes/rentChatRouter.js");
app.use(rentChatRouter);

//Getting access to static files such as CSS, images, videos etc.
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/rentChat"));
app.use(express.static(__dirname + "/public/item"));
app.use(express.static(__dirname + "/public/navbar"));
app.use(express.static(__dirname + "/public/account"));

// //Establishing socket connection
// io.on("connection", socket => {
//     socket.on("Message from user:", (data) => {
//         io.emit("User:", { message: data.message }); 
//     });
// });


//Chat
const adminName = "Admin";

//Establishing socket connection
io.on("connection", socket => {
    socket.on("joinRoom", ({ username, room }) => {
    
    //Admin welcoming a current user
    socket.emit("message", formatMessage(adminName, "Welcome to the chat!"));

    //Emits to all users that a certain user has connected to the room - broadcast.
    socket.broadcast.emit(
        "message", 
        formatMessage(adminName, "A user has joined the chat")
        );
    });

    //Listening for chat messages
    socket.on("chatMessage", msg => {
        io.emit("message", formatMessage("USER", msg)); //Sending message back to the client on "message"
    });

    //When a client disconnects
    socket.on("disconnect", () => {
        io.emit("message", formatMessage(adminName, "A user has left the chat"));
    });
});

//Starting server
messageServer.listen(PORT, (error) => {
    if(error) {
        console.log("Error, server can't run.");
    }
    console.log("Server is running on port", messageServer.address().port);
});