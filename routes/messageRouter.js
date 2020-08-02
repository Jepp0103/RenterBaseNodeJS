const router = require("express").Router();
const Item = require("../models/Item");
const User = require("../models/User");
const Message = require("../models/Message");


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
    
    return res.send({ response: { 
        messagesByItemId,
        usersByMessages
    }});
});

router.post("/addMessage", (req, res) => {
    if (req.session.login) {
        const message = req.body.msg;
        const itemId = req.body.newItemId;
        const userId = req.session.userId;
        
        console.log("newMessage add message", message);
        console.log("item id add message", itemId);

        console.log("userId add message", userId);
    
        if (message && itemId && userId) {
            try {
                Message.query().insert({
                    message,
                    itemId,
                    userId,
                }).then(createdMessage => {
                    return res.redirect("/rentChat");
                });   
            } catch (error) {
                return res.status(500).send({ response: "Something went wrong with the DB" });  
            }
        }

    } else {
        return res.redirect("/login");
    }
});


module.exports = router;