const express = require('express');
const router = express.Router()
const { ClerkExpressWithAuth, ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const isAuthenticated = require('../middleware/isAuthenticated')
const User = require('../models/userModel')
const {
    oneUserData,
    allUsers,
    // deleteUser,
} = require('../controllers/userController')

router.get('/single-user-data/:username', oneUserData)
// router.delete('/delete/:username', deleteUser)

// Must be logged in 
// router.get('/allUsers', ClerkExpressWithAuth(), allUsers)
router.get('/single-user-data-auth/:username', [isAuthenticated, ClerkExpressRequireAuth()], oneUserData)

router.get('/allUsers', async (req, res) => {
    try {
        const allUsers = await User.find({})
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router