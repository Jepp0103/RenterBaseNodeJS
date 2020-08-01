const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");


//Get username and room from a given URL
$.get("/username").done(data => { //Getting username with ajax call for the user currently signed in
    const username = data.response.username;

    $.get("/itemsAndUsers").done(data => {
        for (let i = 0; i < data.response.itemsAndUsers.length; i++) {
            $("#roomSelect").append(
                "<option id = " + data.response.itemsAndUsers[i].itemId + " name = " + data.response.itemsAndUsers[i].itemId + ">" +
                 data.response.itemsAndUsers[i].itemName + 
                ", User: " + data.response.itemsAndUsers[i].username + 
                ", User id: " + data.response.itemsAndUsers[i].userId + 
                ", Item id: " + data.response.itemsAndUsers[i].itemId + 
                "</option>"
            );
        }

        const room = objToString(Qs.parse(location.search, {
                ignoreQueryPrefix: true,
        }));
            
        //Defining the socket
        const socket = io.connect("192.168.0.34:3000");

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
            div.innerHTML = `<p> <b>${message.username} <span>${message.time}</span></b></p> 
            <p class="text">
                ${message.text}
            </p>`;
            document.querySelector(".chat-messages").appendChild(div);  //Adding new div to chat messages.
        }

        //Adding room name to DOM - HTML
        function outputRoomName(room) {
            roomName.innerText = room;
        }

        console.log("username const", username);

        //Adding users to DOM - HTML
        function outputUsers(users) { //Mapping through the array of users
            userList.innerHTML = `
                ${users.map(user => `<li>${user.username}</li>`).join("")} 
            `;
        }
    });

    console.log("url", window.location.href);
    //Getting url in order achieve item id for getting and prepending the messages from the database to the HTML.
    let currentUrl = window.location.href;
    let choosenItemId = currentUrl.charAt(currentUrl.length - 1); //Item id is the last character of the url.

        console.log("Choosen item id after", choosenItemId);

    // Item id to choose in dropdown
    $.get("/messagesAndUsersByItemId/" + choosenItemId).done(data => {
        for (let i = 0; i < data.response.messagesByItemId.length; i++) {
            console.log("Saved messages:", data.response.messagesByItemId[i].message);
            $(".chat-messages").append(
                "<div class=\"message\">" + 
                "<p>" + 
                    "<b>" + 
                        data.response.usersByMessages[i].username +
                    "</b>" + 
                    "</p>" + 
                    "<p class=\"text\">" + 
                        data.response.messagesByItemId[i].message +
                    "</p>" +
                "</div>"
            );
        }
    });  

    function objToString(obj) {
        var str = '';
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str += p + '::' + obj[p] + '\n';
            }
        }
        return str;
    }
});