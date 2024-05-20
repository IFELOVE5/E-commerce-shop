const mongoose = require('mongoose');

const Schema = mongoose.Schema 

const OrderItem = require('./order_items.js')

const User = require(`./user.js`)

const orderSchema = new Schema({
    orderItem: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],

    shippingAddress1:{
        type: String,
        required: true
    },

    shippingAddress2:{
        type: String
    },

    city:{
        type: String,
        required: true
    },

    zip:{
        type: String,
        required: true
    },

    country:{
        type: String,
        required: true
    },

    phone:{
        type: Number,
        required: true
    },

    status:{
        type: String,
        required: true,
        default: `Pending`
    },

    totalPrice:{
        type: Number
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:  `User`
    },

    DateOrdered:{
        type: Date,
        default: Date.now
    },
});

    orderSchema.virtual(`id`).get(function () {
    return this._id.toHexString() })

    orderSchema.set(`toJSON`, {
        virtuals: true
    })

    orderModel = mongoose.model("Order", orderSchema)
    module.exports = orderModel