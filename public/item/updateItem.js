// Ajax call for getting the data for an item
$.get("/items").done(data => {
    $("#name").val(data.response.items.name);
    $("#brand").val(data.response.brand);
    $("#category").val(data.response.category);
    $("#description").val(data.response.description);
    $("#age").val(data.response.age);
    $("#price").val(data.response.price);
    $("#days").val(data.response.days);
});
