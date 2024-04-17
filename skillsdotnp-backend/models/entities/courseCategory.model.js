const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required : true
    }
});

module.exports = new mongoose.model('courseCategory' , categorySchema);
