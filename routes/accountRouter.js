const router = require("express").Router();
const fileSystem = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const User = require("../models/User.js");

//GET methods
router.get("/createAccount", (req, res) => {
    const createAccountPage = fileSystem.readFileSync("./public/account/createAccount.html", "utf-8");
    return res.send(createAccountPage);
});

router.get("/updateAccount", (req, res) => {
    const navbarPage  = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
    const updateAccountPage = fileSystem.readFileSync("./public/account/updateAccount.html", "utf-8");
    const footerPage = fileSystem.readFileSync("./public/footer/footer.html", "utf-8");
    return res.send(navbarPage + updateAccountPage + footerPage);
});

//POST methods
router.post("/createAccount", (req, res) => {
    const { username, password, email, address, city, zipCode, age} = req.body;
    if(username && password && email && address && city && zipCode && age) {
        if(password.length < 8) {
            return res.status(400).send({ response: "Length of password must be 8 characters long and have an uppercase start letter."})
        } else {
            try {
                User.query().select("username").where("username", username).then(foundUser => {
                    if(foundUser.length > 0) {
                        return res.status(400).send({ response: "User already exists in database."});
                    } else {
                        bcrypt.hash(password, saltRounds).then(hashedPassword => {
                            User.query().insert({
                                username, 
                                password: hashedPassword,
                                address,
                                city,
                                zipCode,
                                age,
                                email                                
                            }).then(createdAccount => {
                                return res.redirect("/login");
                            });
                        });
                    }
                });
            } catch (error) {
                return res.status(500).send({ response: "User could not be added to the database."})
            }
        }
    } else {
        return res.status(400).send({ response: "All required form inputs must be filled out."})
    }
});


module.exports = router;

