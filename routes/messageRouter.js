const router = require("express").Router();
const Item = require("../models/Item");
const User = require("../models/User");
const Message = require("../models/User");


//GET methods
router.get("/messagesUsersItemsRooms", async (req, res) => {
    const messagesUsersItemsRooms = await User.query().joinRelated("items").joinRelated("messages").select(
        "users.username",
        "items.itemId", 
        "itemName",
        "messageId", 
        "message").distinct();
    return res.send( { response: {
        messagesUsersItemsRooms
    }});
}); 

router.get("/messagesAndUsersByItemId/:itemId", async (req, res) => {
    console.log("req.params", req.params.itemId);
    const messagesByItemId = await Item.query().joinRelated("messages").select(
        "messageId",
        "message",
        "items.itemId", 
        "messages.userId",
        "itemName"
        ).distinct().where("items.itemId", req.params.itemId);
    
    const usersByMessages = await User.query().joinRelated("messages").select(
        "userId",
        "username",
        "messageId",
        "message",
        "messages.itemId",
    ).where("messages.itemId", req.params.itemId);
    
    console.log("usersbymessages", usersByMessages);

    return res.send({ response: { 
        messagesByItemId,
        usersByMessages
    }});
});





module.exports = router;