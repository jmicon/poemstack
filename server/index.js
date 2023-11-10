const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node")

const port = 4000 || process.env.PORT

require('dotenv').config()

const postRoutes = require('./routes/postRoutes')
const userRoutes = require('./routes/userRoutes')
const clerkRoutes = require('./routes/clerk')
// const testing = require('./routes/testing')

const app = express()
const User = require('./models/userModel')

// middleware
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'https://poemstack.onrender.com'],
    credentials: true
}))

// connect to database and local server
try {
    mongoose.connect(process.env.MONGO_CONNECT_LINK)
        .then(() => {
            app.listen(port, () => console.log(`connected to database and running on http://localhost:${port}`))
        })
} catch (error) {
    console.log(error);
    process.exit(1)
}

// app.use('/user', userRoutes)
app.use('/posts', postRoutes)
app.use('/users', userRoutes)
app.use('/clerk', clerkRoutes)
// app.use('/testing', testing)

app.get('/', (req, res) => {
    res.send("hiis")
})

// CLERK TESTING 
const clerk = require('@clerk/clerk-sdk-node')
// const { users } = require('@clerk/clerk-sdk-node')

app.get('/clerktest', async (req, res) => {
    // const userList = await users.getUserList();
    const userList = await clerk.users.getUserList();
    res.json({ userList })
})


// const clerkRoutes = require('./routes/clerk')
// app.use('/clerk', clerkRoutes)

// SVIX TESTING
// const svix = reqiure("svix")

app.post('/webhooktest', (req, res) => {
    res.json({ data: req.body })
    console.log("webhoook", req.body);
})


// app.post('/clerkSync', async (req, res) => {
//     const { username, id } = req.body.data
//     const { type } = req.body

//     try {
//         if (type === 'user.created') {
//             const exists = User.findOne({ username })
//             if (exists) throw Error('Username is taken')

//             const newUser = await User.create({ username, clerk_id: id })
//             res.status(200).json({ newUser })
//         }
//         if (type === 'user.updated') {
//             const updatedData = await User.findOneAndUpdate({ username })
//             res.json({ updatedData })
//         }
//         if (type === 'user.deleted') {
//             const deletedUser = await User.findOneAndDelete({ clerk_id: id })
//             res.json({ deletedUser })
//         }
//     } catch (error) {
//         res.json({ error: error.message })
//     }
// })

app.get(
    "/protected-endpoint",
    ClerkExpressWithAuth(),
    (req, res) => {
        res.json(req.auth);
    }
);

// Make this logic middleware that returns an error if the req.auth object returns a null
app.get(
    "/protected-endpoint-test",
    ClerkExpressWithAuth(),
    (req, res) => {
        if (req.auth.actor !== null) return res.json({ error: "Not authorized" })
        next()
    }
);