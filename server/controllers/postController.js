const mongoose = require('mongoose');
const Post = require('../models/postModel')
const User = require('../models/userModel')

const newPost = async (req, res) => {
    const { author, content } = req.body
    const { username } = req.auth.claims

    if (content.length > 400) return res.json({ error: "too many characters" })

    const currentUser = await User.findOne({ username })

    try {
        const newPost = await Post.create({ content, author: currentUser })
        res.json(newPost)
    } catch (error) {
        res.json({ error: error.message })
    }
}

const singleUserPosts = async (req, res) => {
    const { username } = req.params
    const author = await User.findOne({ username })

    try {
        const poemData = await Post.find({ author: author._id })
            .populate({
                path: 'author',
                select: ['username', 'firstName', 'lastName', 'profileImage']
            })
        res.json(poemData)
    } catch (error) {
        res.json({ error: error.message })
    }
}
const allPosts = async (req, res) => {

    try {
        const posts = await Post.find({})
            .populate({
                path: 'author',
                select: ['username', 'firstName', 'lastName', 'profileImage']
            })
        res.json(posts)
    } catch (error) {
        res.json({ error: error.message })
    }
}

const allRecentPosts = async (req, res) => {
    const page = req.query.p || 0
    const postsPerPage = 15

    try {
        const posts = await Post.find({})
            .skip(page * postsPerPage)
            .limit(postsPerPage)
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: ['username', 'firstName', 'lastName', 'profileImage']
            })
            .exec()
        res.status(200).json(posts)
    } catch (error) {
        res.json({ error: error.message })
    }

}

const favoritePost = async (req, res) => {
    const { postID } = req.body
    const { username } = req.auth.claims

    try {
        const user = await User.findOne({ username })
        // Adds post like
        if (user.favoritedPosts.includes(postID) === false) {
            const addToPostFavorites = await Post.findOneAndUpdate(
                { _id: postID },
                { $addToSet: { favorites: user._id } },
                { new: true }
            )

            const addToUserFavorites = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { favoritedPosts: postID } },
                { new: true }
            )
            return res.json({ addToPostFavorites, addToUserFavorites })
        }
        // Remove post like
        if (user.favoritedPosts.includes(postID)) {
            const removeFromPostFavorites = await Post.findOneAndUpdate(
                { _id: postID },
                { $pull: { favorites: user._id } },
                { new: true }
            )

            const removeFromUserFavorites = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { favoritedPosts: postID } },
                { new: true }
            )
            return res.json({ removeFromPostFavorites, removeFromUserFavorites })
        }
        res.json({ message: "Something went wrong" })
    } catch (error) {
        res.json({ error: error.message })
    }
}

const onePost = async (req, res) => {
    const { postID } = req.params

    try {
        const post = await Post.findOne({ _id: postID })
            .populate({
                path: 'author',
                select: ['username', 'firstName', 'lastName', 'profileImage']
            })
        res.json(post)
    } catch (error) {
        res.json({ error: error.message })
    }
}

const deletePost = async (req, res) => {
    const { postID } = req.body
    const { username } = req.auth.claims

    try {
        const user = await User.findOne({ username })
        const post = await Post.findOne({ _id: postID })

        if (user._id.toString() !== post.author.toString()) return res.json({ error: "This user can't delete this post " })

        const deletedPost = await Post.findOneAndDelete({ _id: postID })
        res.json(deletedPost)
    } catch (error) {
        res.json({ error: error.message })
    }
}

const search = async (req, res) => {
    // const { searchContent } = req.params
    const searchContent = req.query.s
    const page = req.query.p || 0
    const postsPerPage = 20

    try {
        const poems = await Post.find({ content: { $regex: searchContent, $options: 'i' } })
            .skip(page * postsPerPage)
            .limit(postsPerPage)
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: ['username', 'firstName', 'lastName', 'profileImage']
            })
            .exec()
        res.json(poems)
    } catch (error) {
        res.json({ error: error.message })
    }
}

const DEFAULTNAME = async (req, res) => {
    const { CHANGE } = req.body

    try {
        const DATA = await User.findOne({})
        res.json({ JSON: DATA })
    } catch (error) {
        res.json({ error: error.message })
    }
}

module.exports = {
    newPost,
    singleUserPosts,
    allPosts,
    allRecentPosts,
    favoritePost,
    onePost,
    deletePost,
    search
}