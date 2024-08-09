const express = require('express');

const cookieSession = require('cookie-session')

const createPostRoute = require('./routes/post/create')
const readPostRoute = require('./routes/post/read')
const updatePostRoute = require('./routes/post/update')
const deletePostRoute = require('./routes/post/delete')

const createEbookRoute = require('./routes/ebook/create')

const createCommentRoute = require('./routes/comment/create');
const readCommentRoute = require('./routes/comment/read');
const updateCommentRoute = require('./routes/comment/update');
const deleteCommentRoute = require('./routes/comment/delete');

const signupRoute = require('./routes/auth/signup')
const signinRoute = require('./routes/auth/signin')
const signoutRoute = require('./routes/auth/signout')
const currentUserRoute = require('./routes/auth/current-user')

const currentUser = require('./common/middleware/current-user');

const CustomError = require('./common/errors/custom-error');
const NotFoundError = require('./common/errors/not-found-error');

const app = express()

app.set('trust proxy', true)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieSession({
    signed: false,
    secure: false
}))

//app.use('/upload', express.static('upload'))

app.use('/auth/', signupRoute, signinRoute, signoutRoute, currentUser, currentUserRoute);

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

app.use('/ebook/', currentUser, createEbookRoute);

// not found 
app.all("*", (req, res, next) => {
    next(new NotFoundError())
})

app.use((err, req, res, next) => {
    console.log(err)
    if(err instanceof CustomError) {
        res.status(err.statusCode).json({ errors: err.generateErrors() })
        return;
    }

    res.status(500).json({ errors:[{ message: 'something went wrong'}] })
})

module.exports = app;