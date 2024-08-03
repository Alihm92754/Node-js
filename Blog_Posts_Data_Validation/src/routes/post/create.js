const express = require('express');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/post')

const router = express.Router()

router.post('/create',
    check(['title', 'content', 'excerpt'], 'all fields are required')
    .notEmpty()

    , async (req, res, next) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            const error = new Error(errors.array()[0].msg)
            error.status = 400;
            return next(error);
        }
        const { title, content, excerpt } = req.body

    

    const post = new Post({
        title, content, excerpt, user: req.currentUser.userId
    });

    try {
        await post.save()
    } catch(err) {
        return next(err)
    }

    res.status(200).json({ post })
})

module.exports = router