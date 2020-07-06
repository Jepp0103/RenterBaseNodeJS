const router = require("express").Router();
const fileSystem = require("fs");
const bcrypt = require("bcrypt");
//const User ...

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
        const loginPage = fileSystem.readFileSync("./public/login/login.html", "utf8");
        return res.send(loginPage);
    } else {
        return res.redirect("/main");
    }
});

module.exports = router;
