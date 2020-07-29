const router = require("express").Router();
const Message = require("../models/Message");
const Item = require("../models/Item");


//GET methods
router.get("/messagesAndItemsRooms", async (req, res) => {
    const messagesAndItemsRooms = await Item.query().joinRelated("messages").select(
        "items.itemId", 
        "itemName", 
        "messageId", 
        "message");
    return res.send( { response: {
        messagesAndItemsRooms
    }});
}); 

router.get("/getMessagesByItemId/:itemId", async (req, res) => {
    console.log("Itemid param get message", req.params.itemId);

    const messagesByItemId = await Item.query().joinRelated("messages").select(
        "items.itemId", 
        "itemName", 
        "messageId", 
        "message",
        "messages.itemId")
        .where("items.itemId", req.params.itemId);
    
    return res.send({ response: { 
        messagesByItemId 
    }});
});





module.exports = router;