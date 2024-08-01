const express = require('express');

const Comment = require('../../models/comment')

const router = express.Router()

router.post('/update/:commentId', async (req, res, next) => {
    const { commentId } = req.params;

    const { content } = req.body

    if(!commentId || !content) {
        const error = new Error('comment id is required');
        error.status = 400;
        return next(error)
    }

    try {
        const newComment = await Comment.findByIdAndUpdate(
            commentId, 
            { content },
            { new: true })

        return res.status(200).json({ newComment })
    } catch(err) {
        return next(err)
    }
})

module.exports = router