//Establishing socket connection
$.get("/getUsername").done(data => {

    //Write host ip address for chat room here
     const socket = io.connect("54.86.216.150:80");
 
        const username = data.response.username;
 
        $("#submit").click(() => {
           const time = new Date();
           const comment = time.getHours() + ":" + time.getMinutes() + " " + username + ": " + $("#comment").val();
           $("#comment").val("");
           socket.emit("User wrote:", { comment });
        });
 
        socket.on("User:", data => {
           $("#conversation").prepend(`<div>${data.comment}</div>`);
        });
  });    
 
 
 