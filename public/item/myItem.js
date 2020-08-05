$("#itemName, #labelName").hide();
$("#brand, #labelBrand").hide();
$("#category, #labelCategory").hide();
$("#description, #labelDescription").hide();
$("#itemAge, #labelAge").hide();
$("#price, #labelPrice").hide();
$("#days, #labelDays").hide();
$("#itemId2, #labelItemId2").hide();

$("#updateItemSubmit").hide();

$("#submit").click(() => {
    $("#myItemForm").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/myItems/" + $("#itemId"),
            type: "get",
            data: $("#myItemForm").serialize()
        }).done(function(data) {
            $("#itemId2, #labelItemId2").show();
            $("#itemName, #labelName").show();
            $("#brand, #labelBrand").show();
            $("#category, #labelCategory").show();
            $("#description, #labelDescription").show();
            $("#itemAge, #labelAge").show();
            $("#price, #labelPrice").show();
            $("#days, #labelDays").show();

            $("#itemId2").val(data.response.itemIdConst);
            $("#itemName").val(data.response.itemName);
            $("#brand").val(data.response.brand);
            $("#category").val(data.response.category);
            $("#description").val(data.response.description);
            $("#itemAge").val(data.response.itemAge);
            $("#price").val(data.response.price);
            $("#days").val(data.response.days);

            $("#updateItemSubmit").show();
        });
    });
});



    