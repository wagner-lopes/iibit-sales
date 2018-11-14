var   mongoose = require("mongoose");

//Define the database schema
var itemSchema = mongoose.Schema({
   summary: String,
   image: String,
   description: String,
   price: String,
   comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
   }],
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      name: String
   }
});

//Setup a database model called "items"
module.exports = mongoose.model("Item", itemSchema);