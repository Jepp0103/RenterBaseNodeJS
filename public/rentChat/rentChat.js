$.get("/username").done(data => { //Getting username with ajax call for the user currently signed in
    const username = data.response.username;

    $.get("/itemsAndUsers").done(data => {
        for (let i = 0; i < data.response.itemsAndUsers.length; i++) {
            $("#roomSelect").append(
                "<option id = " + data.response.itemsAndUsers[i].itemId + " name = " + data.response.itemsAndUsers[i].itemId + ">" +
                 data.response.itemsAndUsers[i].itemName + 
                ", User: " + data.response.itemsAndUsers[i].username + 
                ", User id: " + data.response.itemsAndUsers[i].userId + 
                ", Price: " + data.response.itemsAndUsers[i].price + " DKK" +
                ", Brand: " + data.response.itemsAndUsers[i].brand +
                ", Category: " + data.response.itemsAndUsers[i].category +
                ", Days to rent: " + data.response.itemsAndUsers[i].days +
                ", Item id: " + data.response.itemsAndUsers[i].itemId + 
                "</option>"
            );
        }

        //Getting the room from the query string of an url
        const querystringRoom = objToString(Qs.parse(location.search, {
                ignoreQueryPrefix: true
        }));

        //Removing uneccesary prefixes in the room name and details
        const room = querystringRoom.substring(12, querystringRoom.length);
            
        //Defining the socket and connecting to server
        const socket = io.connect("192.168.0.34:3000");

        //Joining chatroom on server
        socket.emit("joinRoom", { username, room });

        //Getting room and users
        socket.on("roomUsers", ({ room, users }) => { //Arrow function passing the data
            outputRoomName(room); //Passing in room and outputting in sidebar
            outputUsers(users); //Passing in users and outputting in sidebar
        });

        //Message from server
        const chatMessages = document.querySelector(".chat-messages");
        socket.on("message", message => {
            outputMessage(message);

            //Scroll down
            chatMessages.scrollTop = chatMessages.scrollHeight; //Allways goes to bottom of scroll page in messages.
        });

        //Message submit
        const chatForm = document.getElementById("chat-form");
        chatForm.addEventListener("submit", e => {
            e.preventDefault();
            
            //Getting message to send from input
            const msg = e.target.elements.msg.value;

            //Emitting message to server
            socket.emit("chatMessage", msg);

            //Clearing input in message area after sending message
            e.target.elements.msg.value = "";
            e.target.elements.msg.focus();
        });

        //Outputting message to DOM
        function outputMessage(message) {
            const div = document.createElement("div"); 
            div.classList.add("message"); //Adding a new div with class named "message" after sending a message

            //Setting the inner HTML/content of the div and adding incoming username, time and message to it
            div.innerHTML = `<p> <b>${message.username}</b> <span>${message.time}</span></p>  
            <p class="text">
                ${message.text}
            </p>`;

            document.querySelector(".chat-messages").appendChild(div);  //Adding new div to chat messages.
        }

        //Adding room name to DOM - HTML
        const roomName = document.getElementById("room-name");
        function outputRoomName(room) {
            roomName.innerText = room;
        }

        //Adding users to DOM in sidebar - HTML
        const userList = document.getElementById("users");
        function outputUsers(users) { //Mapping through the array of users
            userList.innerHTML = `
                ${users.map(user => `<li>${user.username}</li>`).join("")} 
            `;
        }
    });

    //Getting url in order to achieve item id for getting and prepending the messages from the database on the next chat HTML-page.
    let currentUrl = window.location.href;
    let choosenItemId = currentUrl.charAt(currentUrl.length - 1); //Item id is the last character of the url.

    //jQuery ajax call for getting users, messages and time from db by specific item id.
    $.get("/messagesAndUsersByItemId/" + choosenItemId).done(data => { 
        for (let i = 0; i < data.response.messagesByItemId.length; i++) {
            $(".chat-messages").append(  //Appending messages and users on the chat page after choosing selected room. 
                "<div class=\"message\">" + 
                "<p>" + 
                    "<b>" + data.response.usersByMessages[i].username + "</b>" +
                    "<span>" + data.response.messagesByItemId[i].time + "</span>" +
                    "</p>" + 
                    "<p class=\"text\">" + 
                        data.response.messagesByItemId[i].message +  
                    "</p>" +
                "</div>"
            );
        }
    });  

    $("#addMessageButton").click(() => {
        //Setting up date and time for new messages.
        const date = new Date();
        const fullDate = "   " + date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

        const newMessage = $("#msg").val();
        $("#chat-form").submit(function(e) { 
            e.preventDefault();
            $.ajax({ 
                url: "/addMessage", //Sending new message typed in input to server with ajax.
                type: "post",
                data: ({ newMsg: newMessage,
                         time: fullDate,
                         itemId: choosenItemId }), 
            });
        });
    });

    //Formatting querystring to a more readable string
    function objToString(obj) {
        let str = '';
        for (let p in obj) {
            if (obj.hasOwnProperty(p)) {
                str += p + '::' + obj[p] + '\n';
            }
        }
        return str;
    }
});