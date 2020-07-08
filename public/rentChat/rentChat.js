//Establishing socket connection
$.get("/getUsername").done(data => {

    //Write host ip address for chat room here
     const socket = io.connect("192.168.0.34:3000");
 
        const username = data.response.username;
 
        $("#submit").click(() => {
           const time = new Date();
           const message = time.getHours() + ":" + time.getMinutes() + " " + username + ": " + $("#message").val();
           $("#message").val("");
           socket.emit("User wrote: ", { message });
        });
 
        socket.on("User:", data => {
           $("#conversation").prepend(`<div>${ data.message }</div>`);
        });
  });    
 
 
 