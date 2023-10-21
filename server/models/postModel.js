const mongoose = require('mongoose');

const Schema = mongoose.Schema
const userSchema = require('./userModel');

const postSchema = new Schema({
    content: {
        type: String,
        maxlength: 250,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema)
