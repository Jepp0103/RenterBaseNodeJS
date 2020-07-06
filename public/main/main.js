$.get("/items").done(data => {
    for(let i = 0; i < data.response.items.length; i++) {
        $("#items").prepend(
            "<form action=\"/item/" + data.response.items[i].itemId + "\" method=\"GET\"> <p>" + 
            "Name: " + data.response.items[i].name + 
            ", Brand: " + data.response.items[i].brand +
            ", Category: " + data.response.items[i].category +
            ", Description: " + data.response.items[i].description +
            ", Age: " + data.response.items[i].age +
            ", Price: " + data.response.items[i].price +
            "</p>  <input class=\"btn btn-primary\" value=\"Enter room\" type=\"submit\"> </form> <br>");
    }
    //Sockets defined on path variable id in URL
});