//jQuery for displaying username in navbar
$.get("/getUsername").done(data => {
    $("#username").text(data.response.username);
    $("#username").css("color", "black");
});
