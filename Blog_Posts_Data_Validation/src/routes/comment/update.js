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
        const { modifiedCount, acknowledged } = await Comment.updateOne(
            { _id: commentId, user: req.currentUser.userId }, 
            { content })

        if(modifiedCount === 0) {
            if(acknowledged === true) {
                const error = new Error('Not Authorized')
                error.status = 401;
                throw error;
            } 

            const error = new Error('Document not found');
            error.status = 404;
            throw error
        }

        return res.status(200).json({ success: true })
    } catch(err) {
        return next(err)
    }
})

module.exports = router