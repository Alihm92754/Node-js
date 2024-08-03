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
        const post = await Post.findOneAndUpdate({ _id: id, user: req.currentUser.userId }, {
            title, content, excerpt
        }, { new: true })
        
        if(!post) {
            const error = new Error('Document Not Found')
            error.status = 404;
            throw error
        }

        return res.status(200).json({ post })
    } catch(err) {
        return next(err)
    }
})

module.exports = router;