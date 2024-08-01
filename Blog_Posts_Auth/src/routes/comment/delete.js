const express = require('express');

const Comment = require('../../models/comment')

const router = express.Router()

router.delete('/delete/:commentId', async (req, res, next) => {
    const { commentId } = req.params;

    if(!commentId) {
        const error = new Error('comment id is required');
        error.status = 400;
        return next(error)
    }

    try {
        await Comment.findByIdAndDelete(commentId)
        return res.status(200).json({ success: true })
    } catch(err) {
        return next(err)
    }
})

module.exports = router