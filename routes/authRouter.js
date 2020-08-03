const router = require("express").Router();
const fileSystem = require("fs");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { rawListeners } = require("process");

router.get("/", (req, res) => {
    if (req.session.login) {
        return res.redirect("/main");
    } else {
        return res.redirect("/login");    
    }
});

//GET methods
router.get("/login", (req, res) => {
    if (!req.session.login) {
        const navbarPage = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
        const loginPage = fileSystem.readFileSync("./public/login/login.html", "utf-8");
        const footerPage = fileSystem.readFileSync("./public/footer/footer.html", "utf-8");
        return res.send(navbarPage + loginPage + footerPage);
    } else {
        return res.redirect("/main");
    }
});

router.get("/main", (req, res) => {
    if (req.session.login) {
        const navbarPage = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
        const mainPage = fileSystem.readFileSync("./public/main/main.html", "utf-8");
        const footerPage = fileSystem.readFileSync("./public/footer/footer.html", "utf-8");
        return res.send(navbarPage + mainPage + footerPage);
    } else {
        return res.redirect("login");
    }
});

//POST methods
router.post("/main", async (req, res) => {
    const { username, password } = req.body;
    try {
        if (username && password) {
            const validPassword = await User.query().select("id", "username", "email", "password").where("username", username);
        
            if (validPassword.length !== 1) { //Checking if one matching user appears from the database.
                return res.redirect("login");
            }

            if (validPassword.length === 1) {
                bcrypt.compare(password, validPassword[0].password).then(compare => {
                    if (compare === true) {
                        req.session.userId = validPassword[0].id;
                        req.session.login = true;
                        req.session.username = username;
                        req.session.email = validPassword[0].email;
                        return res.redirect("/main");
                    } else {
                        return res.redirect("login");
                    }
                });
            } else {
                return res.redirect("login");
            }
        }
    } catch (error) {
        console.log(error);
    }
});

router.post("/logout", (req, res) => {
    req.session.login = undefined;
    req.session.username = undefined;
    req.session.email = undefined;
    return res.redirect("/login");
});


module.exports = router;
