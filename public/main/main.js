$.get("/itemsAndUsers").done(data => {
    for(let i = 0; i < data.response.itemsAndUsers.length; i++) {
        $("#itemsAndUsers").prepend(
            "<b>Id of user:</b> " + data.response.itemsAndUsers[i].userId + "<br>" + 
            "<b>Name of user:</b> " + data.response.itemsAndUsers[i].username + "<br>" + 
            "<b>Id of item:</b> " + data.response.itemsAndUsers[i].itemId + "<br>" + 
            "<b>Name of item:</b> " + data.response.itemsAndUsers[i].itemName + "<br>" + 
            "<b>Brand:</b> " + data.response.itemsAndUsers[i].brand + "<br>" + 
            "<b>Category:</b> " + data.response.itemsAndUsers[i].category + "<br>" + 
            "<b>Description:</b> " + data.response.itemsAndUsers[i].description + "<br>" + 
            "<b>Age:</b> " + data.response.itemsAndUsers[i].itemAge + "<br>" + 
            "<b>Days to rent:</b> " + data.response.itemsAndUsers[i].days + "<br>" + 
            "<b>Price:</b> " + data.response.itemsAndUsers[i].price + " DKK<br>" + 
            "</p> </form> <br>");
    }
}); 