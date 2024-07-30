const express = require('express');

const Comment = require('../../models/comment')

const router = express.Router()

router.get('/all/:postId', async (req, res, next) => {
    const { postId } = req.params;

    if(!postId) {
        const error = new Error('post id is required');
        error.status = 400;
        return next(error)
    }

    try {
        const comments = await Comment.find({ post: postId });
        return res.status(200).json({ comments })
    } catch (err) {
        return next(err)
    } 
})

router.get('/:commentId', async (req, res, next) => {
    const { commentId } = req.params;

    if(!commentId) {
        const error = new Error('comment id is required');
        error.status = 400;
        return next(error);
    }

    try {
        const comment = await Comment.findById(commentId).populate('post');
        return res.status(200).json({ comment });
    } catch (err) {
        return next(err)
    }
})

module.exports = router