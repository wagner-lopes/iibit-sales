var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    User            = require("./models/user"),
    flash           = require("connect-flash"),
    methodOverride  = require("method-override");

//======================
//  REQUIRING ROUTES
//======================
var commentRoutes   = require("./routes/comments"),
    itemRoutes      = require("./routes/items"),
    indexRoutes     = require("./routes/index");

    
//======================
//  APP CONFIG  
//======================
//Database connection
var databaseurl = process.env.DATABASEURL || "mongodb://localhost/iibit-sales";
mongoose.connect(databaseurl);
//Interpret the body allowing the easyer acces to the body elements and variables
app.use(bodyParser.urlencoded({extended: true}));
//Configure the default view engine file extensios 
app.set("view engine", "ejs");
//includes the /public directory in the auto-search path
app.use(express.static(__dirname + "/public"));
//Allow us to override the http method to use the PUT and DELETE verb
app.use(methodOverride("_method"));
//Flash messages used to pass informations to the user in especific moments
app.use(flash());
//seedDB();

//======================
//  PASSPORT CONFIG  
//======================
app.use(require("express-session")({
    secret: "1554070f3a89df208ab44f56a430f3cf?s=32&d=identicon&r=PG",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Pass informations to every single page
//The logged user and flash informations
// will be passed to to every page and will easely allow
// to control access and pass messages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//======================
//  USING ROUTES  
//======================
app.use("/", indexRoutes);
app.use("/items", itemRoutes);
app.use("/items/:id/comments", commentRoutes);

//======================
//  SERVER CONFIG  
//======================
app.listen(process.env.PORT || 3000, process.env.IP, () => console.log(`Server started at PORT: ${process.env.PORT} !!`));