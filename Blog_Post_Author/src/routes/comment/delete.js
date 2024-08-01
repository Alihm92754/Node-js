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

        const comment = await Comment.findById(commentId);

        if(!comment) {
            const error = new Error('Document not found!');
            error.status = 404;
            return next(error)
        }

        const { deletedCount } = await Comment.deleteOne({ _id: commentId, user: req.currentUser.userId })
        
        if(deletedCount === 0) {
            const error = new Error('Not Authorized');
            error.status = 401;
            return next(error)
        }
        
        return res.status(200).json({ success: true })
    } catch(err) {
        return next(err)
    }
})

module.exports = router