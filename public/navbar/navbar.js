//jQuery for displaying username in navbar
$.get("/username").done(data => {
    $("#username").text(data.response.username);
});
