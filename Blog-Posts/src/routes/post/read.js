const express = require('express');
const Post = require('../../models/post')

const router = express.Router();

router.get('/all', async (req, res, next) => {
    let posts = [];
    try {
        posts = await Post.find({})
    } catch(err) {
        return next(err)
    }

    res.status(200).json({ posts });
})

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    if(!id) {
        const error = new Error('post id is required');
        error.status = 400;

        return next(error);
    }

    let post;

    try {
        post = await Post.findById(id)
    } catch(err) {
        return next(err)
    }

    res.status(200).json({ post })
})

module.exports = router