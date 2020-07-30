const router = require("express").Router();
const Item = require("../models/Item");
const User = require("../models/User");

//GET methods
router.get("/messagesUsersItemsRooms", async (req, res) => {
    const messagesUsersItemsRooms = await User.query().joinRelated("items").joinRelated("messages").select(
        "users.id",
        "users.username",
        "items.itemId", 
        "itemName", 
        "items.userId",
        "messageId", 
        "message").distinct();
    return res.send( { response: {
        messagesUsersItemsRooms
    }});
}); 

router.get("/messagesAndUsersByItemId/:itemId", async (req, res) => {
    const messagesAndUsersByItemId = await User.query().joinRelated("items").joinRelated("messages").select(
        "users.id",
        "username",
        "items.itemId", 
        "itemName", 
        "messageId", 
        "message",
        "messages.itemId").where("items.itemId", req.params.itemId);
    return res.send({ response: { 
        messagesAndUsersByItemId 
    }});
});





module.exports = router;