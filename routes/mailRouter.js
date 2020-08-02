const router = require("express").Router();
const nodemailer = require("nodemailer");
const fs = require("fs");

router.get("/mail", (req, res) => {
    if(req.session.login) {
        const navbar = fs.readFileSync("./public/navbar/navbar.html", "utf8");
        const page = fs.readFileSync("./public/mail/mail.html", "utf8");
        const footer = fs.readFileSync("./public/footer/footer.html", "utf8");
        return res.send(navbar + page + footer);
    } else {
        return res.redirect("/login");
    }
});

router.post("/mail", (req, res) => {
    let transporter = nodemailer.createTransport({
        service: "Gmail", 
    auth: {
        user: "node.exammail2020@gmail.com", 
        pass: "Exammail2020"
    }, 
      tls: { //Added as script, because the system is not running on an online domain but as a localhost service.
        rejectUnauthorized: false
      }
    });

    //Send mail with defined transport object
    let mailOptions = {
    from: '"WebContact" <node.exammail2020@gmail.com>', // sender address
    to: "node.exammail2020@gmail.com", // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.message // plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.log(error);
        }
    console.log("Message sent", req.body.message);
    return res.redirect("/mail");
    });
});

module.exports = router;