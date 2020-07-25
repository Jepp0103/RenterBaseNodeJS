const router = require("express").Router();
const Item = require("../models/Item.js");
const fileSystem = require("fs");
const User = require("../models/User.js");

//GET methods
router.get("/createItem", (req, res) => {
    if (req.session.login) {
        const navbarPage = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
        const createItemPage = fileSystem.readFileSync("./public/item/createItem.html", "utf-8");
        const footerPage = fileSystem.readFileSync("./public/footer/footer.html");
        return res.send(navbarPage + createItemPage + footerPage);
    } else {
        return res.redirect("/login");
    }
});

router.get("/items", async (req, res) => {
    if (req.session.login) {
        const items = await Item.query().select();
        const users = await User.query().select().withGraphFetched("items");
        return res.send( { response: {
            items,
            users
        }});
    } else {
        return res.redirect("/login");
    }
});

router.get("/myItems", async (req, res) => {
    if(req.session.login) {
        userId = req.session.userId;
        const myItems = await Item.query().
            select(
                "item_id",
                "user_id",
                "name", 
                "brand", 
                "category", 
                "description", 
                "age", 
                "price", 
                "days")
                .where("user_id", userId);
        return res.send({ response: { 
                myItems
            }});    
    } else {
     return res.redirect("/login");
    }
});


router.get("/deleteItem", (req, res) => {
    if (req.session.login) {
        const navbarPage = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
        const deleteItemPage = fileSystem.readFileSync("./public/item/deleteItem.html", "utf-8");
        const footerPage = fileSystem.readFileSync("./public/footer/footer.html", "utf-8");
        return res.send(navbarPage + deleteItemPage + footerPage);
    } else {
        return res.redirect("/login");
    }
})

router.get("/myItems/:itemId", async (req, res) => {
    console.log("Item id query", req.query.itemId);
    req.params.itemId = req.query.itemId;
    if (req.session.login) {
        const item = await Item.query().select().where("itemId", req.params.itemId).andWhere("userId", req.session.userId); 
        const name = item[0].name;
        console.log(item);
        return res.send({ response: { 
            name 
        } 
        }); //Response will be empty if the itemId doesn't exists
    } else {
        return res.redirect("/login");
    }
});

router.get("/updateItem", (req, res) => {
    if (req.session.login) {
        const navbarPage = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
        const updateItemPage = fileSystem.readFileSync("./public/item/updateItem.html", "utf-8");
        const footerPage = fileSystem.readFileSync("./public/footer/footer.html", "utf-8");
        return res.send(navbarPage + updateItemPage + footerPage);
    } else {
        return res.redirect("/login");
    }
});


// router.get("/myItemData/itemId", async (req, res) => {


//     if (req.session.login) {
//         try {

//         const itemInfo = await Item.query().select("name", "brand", "category", "description", "age", "price", "days", "userId")
//         .where("itemId", req.params.itemId).andWhere("userId", req.session.userId);
//         const name = itemInfo[0].name;

//         return res.send( { response: {
//             name: name
//         }});
//         } catch (error) {
//             return res.status(500).send({ response: "Error in database occured or item belongs to another account."});
//         }
//     } else {
//         return res.redirect("/login");
//     }
// });

//POST methods
router.post("/createItem", (req, res) => {
    const { name, brand, category, description, age, price, days } = req.body;
    const userId = req.session.userId;

    if (name && brand && category && description && age && price && days) {
        try {
            Item.query().insert({
                userId, 
                name, 
                brand, 
                category,
                description,
                age,
                price,
                days
            }).then(createdItem => {
                return res.redirect("/main");
            });
        } catch (error) {
            return res.status(500).send({ response: "Error in database occured."});
        }
    }
});

//Deleting items
router.post("/deleteItem", (req, res) => {
    if (req.session.login) {
        console.log("Deleted item id", req.body.deletedItemId);
        try {
            Item.query().delete().where("itemId", req.body.deletedItemId)
            .then(deletedItem => {
                return res.redirect("/deleteItem")
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        return res.redirect("/login");
    }
});

module.exports = router;