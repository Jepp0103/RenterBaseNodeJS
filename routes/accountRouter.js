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



//POST methods
router.post("/createAccount", (req, res) => {
    const { username, email, password } = req.body;
    if(username && password) {
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
                                email, 
                                password: hashedPassword
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

