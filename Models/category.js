const mongoose = require('mongoose')


const Schema = mongoose.Schema

const categorySchema = new Schema({
    name:{
        type: String,
        required: true
    },

    colour:{
        type: String,
    },
    
    icon:{
        type: String,
    },
    
    image:{
        type: String,
    },
    

})


categoryModel = mongoose.model('Category', categorySchema)
module.exports = categoryModel