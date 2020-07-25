$("#name, #labelName").hide();

$("#submit").click(() => {
    $("#myItemForm").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/myItems/" + $("#itemId"),
            type: "get",
            data: $("#myItemForm").serialize(),
            success: function(data) {
                $("#name, #labelName").show();
                $("#name").val(data.response.name);
            }
        });
    });
});
    