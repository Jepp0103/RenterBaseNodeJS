const router = require("express").Router();
const fileSystem = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const User = require("../models/User.js");

//GET methods
router.get("/createAccount", (req, res) => {
    const navbarPage  = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
    const createAccountPage = fileSystem.readFileSync("./public/account/createAccount.html", "utf-8");
    const footerPage = fileSystem.readFileSync("./public/footer/footer.html", "utf-8");
    return res.send(navbarPage + createAccountPage + footerPage);
});

router.get("/updateAccount", (req, res) => {
    if (req.session.login) {
        const navbarPage  = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
        const updateAccountPage = fileSystem.readFileSync("./public/account/updateAccount.html", "utf-8");
        const footerPage = fileSystem.readFileSync("./public/footer/footer.html", "utf-8");
        return res.send(navbarPage + updateAccountPage + footerPage);
    } else {
        return res.redirect("/login");
    }
});

router.get("/accountData", async (req, res) => {
    if (req.session.login) {
        const accountInfo = await User.query().select("username", "address", "city", "zip_code", "age", "email").where("id", req.session.userId);
        const username = accountInfo[0].username;
        const address = accountInfo[0].address;
        const city = accountInfo[0].city;
        const zipCode = accountInfo[0].zipCode;
        const age = accountInfo[0].age;
        const email = accountInfo[0].email;
        return res.send( { response: {
            username: username,
            address: address,
            city: city,
            zipCode: zipCode,
            age: age,
            email: email
        }});
    } else {
        return res.redirect("/login");
    }
});

router.get("/username", (req, res) => {
    if (req.session.login) {
        return res.send({ response: req.session });
    } else {
        res.redirect("/login");
    }
});

//POST methods
router.post("/createAccount", (req, res) => {
    const { username, 
            password, 
            email, 
            address, 
            city, 
            zipCode, 
            age } = req.body;
    
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

router.post("/updateAccount", async (req, res) => {
    const { username,
            newPassword, 
            currentPassword,
            address,
            city, 
            zipCode,
            age,
            email } = req.body;
    try {
        if (username && newPassword && currentPassword && address && city && zipCode && age && email) {

            const accountInfo = await User.query().select("id", "username", "password", "address", "city", "zip_code", "age", "email")
            .where("id", req.session.userId);

            if (accountInfo.length === 1) {
                bcrypt.compare(currentPassword, accountInfo[0].password).then(compare => {
                    if (compare === true) {
                        bcrypt.hash(newPassword, saltRounds).then(hashedPassword => {
                            User.query().where("id", req.session.userId).update({
                                username: req.body.username,
                                password: hashedPassword,
                                address: req.body.address,
                                city: req.body.city,
                                zip_code: req.body.zipCode,
                                age: req.body.age,
                                email: req.body.email
                            }).then(updatedAccount => {
                                req.session.username = username;
                                req.session.address = address;
                                req.session.city = city;
                                req.session.zipCode = zipCode;
                                req.session.age = age;
                                req.session.email = email;
                                return res.redirect("/updateAccount");
                            })
                        });
                    }
                });
            } else {
                return res.redirect("/updateAccount");
            }
        } else {
            return res.redirect("/updateAccount");
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

