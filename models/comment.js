var mongoose = require("mongoose");

//Define the database schema
var commentSchema = mongoose.Schema({
   text: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      name: String
   }
});

//Setup a database model called "Campgrounds"
module.exports = mongoose.model("Comment", commentSchema);