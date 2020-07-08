$.get("/items").done(data => {
    for(let i = 0; i < data.response.items.length; i++) {
        $("#items").prepend(
            "<form action=\"/item/" + data.response.items[i].itemId + "\" method=\"GET\"> <p>" + 
            "<b>Name</b>: " + data.response.items[i].name + "<br>" + 
            "<b>Brand</b>: " + data.response.items[i].brand + "<br>" + 
            "<b>Category</b>: " + data.response.items[i].category + "<br>" + 
            "<b>Description</b>: " + data.response.items[i].description + "<br>" + 
            "<b>Age</b>: " + data.response.items[i].age + "<br>" + 
            "<b>Price</b>: " + data.response.items[i].price + "<br>" + 
            "</p> </form> <br>");
    }
});