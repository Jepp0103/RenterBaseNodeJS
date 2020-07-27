const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//Get username and room from a given URL
const { username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//Joining chatroom
socket.emit("joinRoom", { username, room });


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