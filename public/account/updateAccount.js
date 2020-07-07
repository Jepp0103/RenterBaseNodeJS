// Ajax call for getting the username
$.get("/updateUserData").done(data => {
    $("#username1").val(data.response.username);
    $("#email").val(data.response.email);
});






