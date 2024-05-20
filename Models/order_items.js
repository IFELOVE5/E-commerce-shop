 const mongoose = require('mongoose');

 const Schema = mongoose.Schema

 const Product = require(`./product.js`)

 const orderItemSchema = new Schema({

    quantity:{
        type: Number,
        require: true,
        min: 1
    },

    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: `Product`
    }
 })


 orderItemModel = mongoose.model("OrderItem", orderItemSchema)
 module.exports = orderItemModel