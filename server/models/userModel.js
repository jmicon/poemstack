const mongoose = require('mongoose');

const Schema = mongoose.Schema
const postSchema = require('./postModel')

const userSchema = new Schema({
    username: {
        type: String,
        // unique: true,
        required: true,
    },
    clerk_id: {
        type: String,
        unique: true,
        required: true,
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    bio: {
        type: String,
        maxlength: 200,
        default: ""
    },
    firstName: {
        type: String,
        default: function () {
            return this.username
        }
    },
    lastName: {
        type: String,
        default: function () {
            return ""
        }
    },
    profileImage: {
        type: String,
        default: function () {
            return "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVjkyRHdIWFZNcDFlTzVkUDVvWmtac01uQksiLCJyaWQiOiJ1c2VyXzJWZlZqTGFBeDlBSTVIc251R2hoelpLQ1piOSIsImluaXRpYWxzIjoiVCJ9"
        }
    },
    favoritedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)