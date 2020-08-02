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
        "time",
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

//Post methods
router.post("/addMessage", (req, res) => {
    if (req.session.login) {
        //Getting all values from jQuery ajax call
        const time = req.body.time;
        const message = req.body.newMsg;
        const itemId = req.body.itemId;
        const userId = req.session.userId;   
        if (message && itemId && userId) {
            try {
                Message.query().insert({
                    message,
                    time,
                    itemId,
                    userId
                }).then(addedMessage => {
                    console.log("Message,", message, ", added.");
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