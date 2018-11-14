var express         = require("express"),
    router          = express.Router(),
    Item            = require("../models/item"),
    middleware      = require("../middleware"),
    bodyParser      = require("body-parser");


router.use(bodyParser.urlencoded({extended: true}));

//======================
//  ItemS ROUTES  
//======================

//LIST ALL ItemS
router.get("/", (req, res) => {
    Item.find({}, (err, allItems) => {
        if(err){
            console.log(err);
        } else {
            res.render("items/items", {items: allItems});
        }
    });
});

//CREATE NEW Item
router.get("/new", middleware.isLoggedIn, (req, res) => res.render("items/new"));

//CREATE Item LOGIC
router.post("/new", middleware.isLoggedIn, (req, res) => {
    Item.create(req.body.item, (err, item) => {
          if(err){
              console.log(err);
          } else {
                item.author.id = req.user._id;
                item.author.name = req.user.name;
                item.save();
                res.redirect("/items");
          }
        });
});

//SHOW ItemS
router.get("/:id", (req, res) => {
    Item.findById(req.params.id).populate("comments").exec((err, foundItem) => {
          if(err){
              console.log(err);
          } else {
              res.render("items/show", {item: foundItem});
          }
        });
});

//EDIT ItemS
router.get("/:id/edit", middleware.checkItemOwnership, (req, res) => {
    Item.findById(req.params.id, (err, foundItem) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("items/edit", {item: foundItem}); 
        }
    });
});

//UPDATE ItemS
router.put("/:id", middleware.checkItemOwnership, (req, res) => {
   Item.findByIdAndUpdate(req.params.id, req.body.item, (err) => {
       if(err){
           res.redirect("/items");
       } else {
           res.redirect("/items/" + req.params.id);
       }
   });
});

//DELETE ITEM
router.delete("/:id", middleware.checkItemOwnership, (req, res) => {
   Item.findByIdAndRemove(req.params.id, (err) => {
       if(err){
           console.log(err);
           res.redirect("/items/" + req.params.id);
       } else {
           res.redirect("/items");
       }
   });
});

module.exports = router;



                //Início da inclusão do arquivo no SO
                // fs.writeFile("/images/" + req.body.file, "Hey there!", function(err) {
                //     if(err) {
                //         return console.log(err);
                //     }
                //     console.log("The file was saved!");
                // });
                //Fim da inclusão do arquivo
                
                
                // var form = new formidable.IncomingForm();
                // form.parse(req);
                
                // form.on('fileBegin', function (name, file){
                //     file.path = dirname + file.name;
                //     //item.image = dirname + file.name;
                //     console.log(file.path);
                // });
            
                // form.on('file', function (name, file){
                //     console.log('Uploaded ' + file.name);
                // });