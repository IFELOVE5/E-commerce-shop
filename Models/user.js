const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({

    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    passwordHash:{
        type: String,
        required: true
    },

    phone:{
        type: String,
        required: true
    },

    isAdmin:{
        type: Boolean,
        default: false
    },

    street:{
        type: String,
        default: ''
    },

    apartment:{
        type: String,
        default: ''
    },

    city:{
        type: String,
        default: ''
    },

    country:{
        type: String,
        default: ''
    },

    zip:{
        type: String,
        default: ''
    },  
});

    userSchema.virtual('id').get( function () {
        return this._id.toHexString();
    });

    userSchema.set('toJSON', {
        virtuals: true
    })

   
    userModel = mongoose.model("User", userSchema)
    module.exports = userModel