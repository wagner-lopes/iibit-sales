var Item            = require("../models/item"),
    Comment         = require("../models/comment"),
    middlewareObj   = {};

//MIDDLEWARE TO VERIFY IS THE USER IS LOGGED IN
middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
}

//MIDDLEWARE TO VERIFY IS THE USER IS THE OWNER OF THE Item
middlewareObj.checkItemOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Item.findById(req.params.id, (err, foundItem) => {
            if(err){
                req.flash("error", "Item not found!");
                res.redirect("back");
            } else {
                if(foundItem.author.id.equals(req.user._id)){
                    next();    
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

//MIDDLEWARE TO VERIFY IS THE USER IS THE OWNER OF THE COMMENT
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentid, (err, foundComment) => {
            if(err){
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else if(foundComment) {
                if(foundComment.author.id.equals(req.user._id)){
                    next();    
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            } else {
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;