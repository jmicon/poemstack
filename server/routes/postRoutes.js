const express = require('express');
const router = express.Router()
const { ClerkExpressWithAuth, ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const isAuthenticated = require('../middleware/isAuthenticated')

const {
    newPost,
    singleUserPosts,
    allPosts,
    allRecentPosts,
    favoritePost,
    onePost,
    deletePost,
    search
} = require('../controllers/postController')


router.get('/all-posts', allPosts)
router.get('/all-recent-posts', allRecentPosts)
router.get('/single-user-posts/:username', singleUserPosts)
router.get('/single/:postID', onePost)
router.get('/search', search)

// Protected
router.post('/new-post', [isAuthenticated, ClerkExpressRequireAuth()], newPost)
router.put('/favorite-post', [isAuthenticated, ClerkExpressRequireAuth()], favoritePost)
router.delete('/delete', [isAuthenticated, ClerkExpressRequireAuth()], deletePost)
// router.post('/favorite', [isAuthenticated, ClerkExpressRequireAuth()], favoritePost)

module.exports = router