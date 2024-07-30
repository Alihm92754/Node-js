const express = require('express');

const Comment = require('../../models/comment')

const router = express.Router()

router.post('/:postId/create', async (req, res, next) => {
    const { postId } = req.params;
    const { content } = req.body;

    if(!postId || !content) {
        const error = new Error('Invalid data');
        error.status = 400;
        return next(error);
    }

    try {
        const comment = new Comment({ content, post: postId });
        await comment.save();

        return res.status(200).json({ comment })
    } catch (err) {
        return next(err)
    }
})

module.exports = router
