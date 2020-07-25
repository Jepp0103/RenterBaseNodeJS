$("#name, #labelName").hide();
$("#brand, #labelBrand").hide();
$("#category, #labelCategory").hide();
$("#description, #labelDescription").hide();
$("#age, #labelAge").hide();
$("#price, #labelPrice").hide();
$("#days, #labelDays").hide();

$("#updateItemSubmit").hide();


$("#submit").click(() => {
    $("#myItemForm").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/myItems/" + $("#itemId"),
            type: "get",
            data: $("#myItemForm").serialize(),
            success: function(data) {
                $("#name, #labelName").show();
                $("#brand, #labelBrand").show();
                $("#category, #labelCategory").show();
                $("#description, #labelDescription").show();
                $("#age, #labelAge").show();
                $("#price, #labelPrice").show();
                $("#days, #labelDays").show();
                
                $("#name").val(data.response.name);
                $("#brand").val(data.response.brand);
                $("#category").val(data.response.category);
                $("#description").val(data.response.description);
                $("#age").val(data.response.age);
                $("#price").val(data.response.price);
                $("#days").val(data.response.days);

                $("#updateItemSubmit").show();
            }
        });
    });
});
    