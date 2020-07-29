const router = require("express").Router();
const Message = require("../models/Message");
const Item = require("../models/Item");
const User = require("../models/User");



//GET methods
router.get("/messagesUsersItemsRooms", async (req, res) => {
    const messagesUsersItemsRooms = await User.query().joinRelated("items").joinRelated("messages").select(
        "users.id",
        "users.username",
        "items.itemId", 
        "itemName", 
        "messageId", 
        "message");
    return res.send( { response: {
        messagesUsersItemsRooms
    }});
}); 

router.get("/getMessagesByItemId/:itemId", async (req, res) => {
    const messagesByItemId = await Item.query().joinRelated("messages").select(
        "items.itemId", 
        "itemName", 
        "messageId", 
        "message",
        "messages.itemId").where("items.itemId", req.params.itemId);
    
    return res.send({ response: { 
        messagesByItemId 
    }});
});





module.exports = router;