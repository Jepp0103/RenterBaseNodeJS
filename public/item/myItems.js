$.get("/myItems").done(data => {
    for(let i = 0; i < data.response.myItems.length; i++) {
        $("#myItems").prepend(
            "<form action=\"/item/" + data.response.myItems[i].itemId + "\" method=\"GET\"> <p>" + 
            "<b>Item id: </b> " + data.response.myItems[i].itemId + "<br>" +
            "<b>Name</b>: " + data.response.myItems[i].itemName + "<br>" + 
            "<b>Brand</b>: " + data.response.myItems[i].brand + "<br>" + 
            "<b>Category</b>: " + data.response.myItems[i].category + "<br>" + 
            "<b>Description</b>: " + data.response.myItems[i].description + "<br>" + 
            "<b>Age</b>: " + data.response.myItems[i].itemAge + "<br>" + 
            "<b>Price</b>: " + data.response.myItems[i].price + "<br>" + 
            "</p> </form> <br>");
    }
});