// Ajax call for getting the data for a user
$.get("/accountData").done(data => {
    $("#username2").val(data.response.username);
    $("#email").val(data.response.email);
    $("#address").val(data.response.address);
    $("#city").val(data.response.city);
    $("#zipCode").val(data.response.zipCode);
    $("#userAge").val(data.response.userAge);
});