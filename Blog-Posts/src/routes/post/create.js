const express = require('express');

const Post = require('../../models/post')

const router = express.Router()

router.post('/create', async (req, res, next) => {
    const { title, content, excerpt } = req.body

    if(!title || !content || !excerpt) {
        const error = new Error('all fields are required');
        error.status = 400;

        return next(error);
    }

    const post = new Post({
        title, content, excerpt
    });

    try {
        await post.save()
    } catch(err) {
        return next(err)
    }

    res.status(200).json({ post })
})

module.exports = router