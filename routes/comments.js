var express         = require("express"),
    //The "mergeParams" object is used to merge the Items
    // params with, "/Items/:id", with comments params
    //This is used in the routers "/new", and "/", for example
    //Without this merge, would be impossible to access req.params.id
    // and the Item.findById would return "null"
    router          = express.Router({mergeParams: true}),
    Item            = require("../models/item"),
    Comment         = require("../models/comment"),
    middleware      = require("../middleware");

//=================
// COMMENTS ROUTES
//=================

// NEW COMMENT PAGE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Item.findById(req.params.id, (err, foundItem) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {item: foundItem});
        }
    });
});

// CREATE NEW COMMENT ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
    Item.findById(req.params.id, (err, Item) => {
        if(err){
            console.log(err);
            res.redirect("/items");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.name = req.user.name;
                    comment.save();
                    Item.comments.push(comment);
                    Item.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/items/" + Item._id);
                }
            });
        }
    });
});

//EDIT COMMENT
router.get("/:commentid/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.commentid, (err, foundComment) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/edit", {comment: foundComment, item_id: req.params.id});
        }
    });
});

//UPDATE COMMENT
router.put("/:commentid", middleware.checkCommentOwnership, (req, res) => {
   Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, (err) => {
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/items/" + req.params.id);
       }
   });
});

//DELETE COMMENT
router.delete("/:commentid", middleware.checkCommentOwnership, (req, res) => {
   Comment.findByIdAndRemove(req.params.commentid, (err) => {
       if(err){
           console.log(err);
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted!");
           res.redirect("back");
       }
   });
});

module.exports = router;