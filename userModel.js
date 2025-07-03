const mongoose = require('mongoose')


const { types } = require('mime-types')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name :{
        type : String,
        require : true,
    },
    email :{
        type : String,
        require : true,
        unique : true,
    },

    password :{
        type : String,
        require : true,
    },

});

const userModel = mongoose.mongoose.model('user', userSchema)

module.exports = userModel;