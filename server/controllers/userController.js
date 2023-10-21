const mongoose = require('mongoose');
const Post = require('../models/postModel')
const User = require('../models/userModel')

const oneUserData = async (req, res) => {
    const { username } = req.params

    try {
        const userData = await User.findOne({ username })
        res.json(userData)
    } catch (error) {
        res.json({ error: error.message })
    }
}

const allUsers = async (req, res) => {
    try {
        const allUsers = await User.find({})
        res.json(allUsers)
    } catch (error) {
        res.json({ error: error.message })

    }
}

const deleteUser = async (req, res) => {
    const { username } = req.params

    try {
        const deletedUser = await User.findOneAndDelete({ username })
        res.json({ deletedUser })
    } catch (error) {
        res.json({ error: error.message })
    }
}

module.exports = {
    oneUserData,
    allUsers,
    deleteUser
}