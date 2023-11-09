const express = require('express');
const router = express.Router()
require('dotenv').config()
const User = require('../models/userModel')
const Svix = require('svix');

router.post('/clerk-sync', async (req, res) => {
    try {
        const { username, id, first_name, last_name, image_url } = req.body.data
        const { type } = req.body

        switch (type) {
            case 'user.created':
                const newUser = await User.create({ username, clerk_id: id, profileImage: image_url })
                res.status(200).json({ newUser })
                break;

            case 'user.updated':
                const updatedData = await User.updateOne(
                    { clerk_id: id },   // ID of user we're searching for 
                    { $set: { username, firstName: first_name, lastName: last_name } }, // setting the username property to the username variable
                    { upsert: true }    // update if found, insert if not found
                )
                res.json({ updatedData })
                break;

            case 'user.deleted':
                const deletedUser = await User.findOneAndDelete({ clerk_id: id })
                res.json({ deletedUser })
                break;
        }
    } catch (error) {
        res.json({ error: error.message })
    }
})

module.exports = router