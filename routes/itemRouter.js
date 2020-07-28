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
        const users = await User.query().select();
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
});

router.get("/myItems/:itemId", async (req, res) => {
    console.log("Item id query", req.query.itemId);
    req.params.itemId = req.query.itemId;
    try {
        if (req.session.login) {
            const item = await Item.query().select().where("itemId", req.params.itemId).andWhere("userId", req.session.userId); 
            const itemIdConst = item[0].itemId;
            const name = item[0].name;
            const brand = item[0].brand;
            const category = item[0].category;
            const description = item[0].description;
            const age = item[0].age;
            const price = item[0].price;
            const days = item[0].days;
            console.log(item);
            return res.send({ response: { 
                    itemIdConst,
                    name,
                    brand,
                    category,
                    description,
                    age,
                    price,
                    days
                } 
            }); //Response will be empty if the itemId doesn't exists
        } else {
            return res.redirect("/login");
        }
    } catch  (error) {
        console.log(error);
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

router.post("/updateItem", (req, res) => {
    try {
        Item.query().where("userId", req.session.userId).andWhere("itemId", req.body.itemId2).update({
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category,
            description: req.body.description,
            age: req.body.age,
            price: req.body.price,
            days: req.body.days
        }).then(updatedItem => {
            return res.redirect("/updateItem");
        })
    } catch (error) {
        console.log(error);
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