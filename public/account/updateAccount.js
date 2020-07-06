// Ajax call for getting the username
$.get("/updateUserData").done(data => {
    $("#username2").val(data.response.username);
    $("#email").val(data.response.email);
});

fetch("/updateUserData").then(response => response.json()).then(data => {
    console.log(data);
    document.getElementById("username2")
});




