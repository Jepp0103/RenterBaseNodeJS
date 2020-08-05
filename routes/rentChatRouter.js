const router = require("express").Router();
const fileSystem = require("fs");

//GET methods
router.get("/rentChat", (req, res) => {
    if (req.session.login) {
        const navbarPage = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
        const rentChatPage = fileSystem.readFileSync("./public/rentChat/rentChat.html", "utf-8");
        const footerPage = fileSystem.readFileSync("./public/footer/footer.html", "utf-8");
        res.send(navbarPage + rentChatPage + footerPage);
    } else {
        res.redirect("/login");
    }
});

router.get("/enterChat", (req, res) => {    
    if (req.session.login) {
        const navbarPage = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
        const enterChatPage = fileSystem.readFileSync("./public/rentChat/enterChat.html", "utf-8");
        const footerPage = fileSystem.readFileSync("./public/footer/footer.html", "utf-8");
        res.send(navbarPage + enterChatPage + footerPage);
    } else {
        res.redirect("/login");
    }
});

module.exports = router;
