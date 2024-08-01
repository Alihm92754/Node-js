const express = require('express');
const mongoose = require('mongoose')

const createPostRoute = require('./routes/post/create')
const readPostRoute = require('./routes/post/read')
const updatePostRoute = require('./routes/post/update')
const deletePostRoute = require('./routes/post/delete')

const createCommentRoute = require('./routes/comment/create');
const readCommentRoute = require('./routes/comment/read');
const updateCommentRoute = require('./routes/comment/update');
const deleteCommentRoute = require('./routes/comment/delete');

const signupRoute = require('./routes/auth/signup')
const signinRoute = require('./routes/auth/signin')

const currentUser = require('./common/middleware/current-user')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth/', signupRoute, signinRoute);

app.use('/posts/', 
    readPostRoute,
    currentUser, 
    createPostRoute, 
    updatePostRoute,
    deletePostRoute
)

app.use('/comment/', 
    readCommentRoute,
    currentUser,
    createCommentRoute,
    updateCommentRoute,
    deleteCommentRoute
);

// not found 
app.all("*", (req, res, next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    if(err.status) {
        res.status(err.status).json({ error: err.message })
        return;
    }

    res.status(500).json({ error: 'something went wrong' })
})

mongoose.connect('mongodb+srv://AliHm:778899@nodeexpressprojects.xjjbzzg.mongodb.net/blog?retryWrites=true&w=majority&appName=NodeExpressProjects')
.then(() => {
    app.listen(3000, () => {
        console.log("Server is up and running on port 3000")
    })
}).catch(err => {
    throw new Error('Database connection failed!')
})