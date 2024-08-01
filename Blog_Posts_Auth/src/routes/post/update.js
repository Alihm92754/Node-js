const express = require('express')

const Post = require('../../models/post')

const router = express.Router();

router.post('/update/:id', async (req, res, next) => {
    const { id } = req.params
    const { title, content, excerpt } = req.body;

    if((!title && !content && !excerpt) || !id) {
        const error = new Error('bad request');
        error.status = 400;

        return next(error);
    }

    try {
        const post = await Post.findByIdAndUpdate(id, {
            title, content, excerpt
        }, { new: true })

        return res.status(200).json({ post })
    } catch(err) {
        return next(err)
    }
})

module.exports = router;