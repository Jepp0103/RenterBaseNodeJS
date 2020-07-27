const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");


//Get username and room from a given URL
const { username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//Joining chatroom
socket.emit("joinRoom", { username, room });

//Getting room and users
socket.on("roomUsers", ({ room, users }) => { //Arrow function passing the data
    outputRoomName(room); //Passing in room and outputting in sidebar
    outputUsers(users); //Passing in users and outputting in sidebar
});

//Message from server
socket.on("message", message => {
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight; //Allways goes bottom of scroll page in messages.
});


//Message submit
chatForm.addEventListener("submit", e => {
    e.preventDefault();
    
    //Getting message to 
    const msg = e.target.elements.msg.value;

    //Emitting message to server
    socket.emit("chatMessage", msg);

    //Clearing input in message area
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message) {
    const div = document.createElement("div"); 
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p> 
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector(".chat-messages").appendChild(div);  //Adding new div to chat messages.
}

//Adding room name to DOM - HTML
function outputRoomName(room) {
    roomName.innerText = room;
}

//Adding users to DOM - HTML
function outputUsers(users) { //Mapping through the array of users
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join("")} 
    `;
}