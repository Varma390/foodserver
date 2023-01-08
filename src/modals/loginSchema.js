const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
    }
})

const UserModal = mongoose.model('users', userSchema)

const recipeSchema = mongoose.Schema({
    Name: {
        type: String,
        // required: true,
    },
    Image: {
        type: String,
    },
 
    Description: {
        type: String,
    },
    Ingredients: {
        type: Array,
    },
    Steps: {
        type: Array,
    },
    userid: {
        type: mongoose.Schema.ObjectId,
        ref: UserModal,
    }
})

const recipeModal = mongoose.model('recipes',recipeSchema)
module.exports = {UserModal, recipeModal}