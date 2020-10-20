var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

//ROOT ROUTE
router.get("/", (req, res) => res.redirect("/items"));

//USER REGISTRY
router.get("/register", (req, res) => res.render("users/register"));

//USER CREATE LOGIC
router.post("/register", (req, res) => {
    //Create an user only with the username. The password will
    //be encrypted before to be stored
    User.register({name: req.body.name, username: req.body.username}, req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            //The "local" indicates the auth strategy
            //This also could be "facebook" or "tweeter", for example
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Welcome to IIBIT Sales " + user.name + "!");
                res.redirect("/items");
            });
        }
    });
});

//USER LOGIN SCREEN
router.get("/login", (req, res) => res.render("users/login"));

//USER LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
    successRedirect: "/items",
    failureRedirect: "/login"
}), (req, res) => {});

//LOGOUT
router.get("/logout", (req, res) => {
   req.logout();
   req.flash("success", "Logged you out!")
   res.redirect("/items");
});

module.exports = router;