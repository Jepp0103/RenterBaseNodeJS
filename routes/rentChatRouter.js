const router = require("express").Router();
const fileSystem = require("fs");

//GET methods
router.get("/rentChat", (req, res) => {
    if (req.session.login) {
        const navbarPage = fileSystem.readFileSync("./public/navbar/navbar.html", "utf-8");
        const rentChatPage = fileSystem.readFileSync("./public/rentChat/rentChat.html", "utf-8");
        const footerPage = fileSystem.readFileSync("./public/footer/footer.html", "utf-8");
        return res.send(navbarPage + rentChatPage + footerPage);
    }
});


module.exports = router;