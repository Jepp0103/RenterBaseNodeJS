// Ajax call for getting the username
$.get("/accountData").done(data => {
    $("#username1").val(data.response.username);
    $("#email").val(data.response.email);
    $("#address").val(data.response.address);
    $("#city").val(data.response.city);
    $("#zipCode").val(data.response.zipCode);
    $("#age").val(data.response.age);
});






