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

        const post = await Post.findById(id);

        if(!post) {
            const error = new Error('Document not found!');
            error.status = 404;
            return next(error)
        }

        const { modifiedCount } = await Post.updateOne({ _id: id, user: req.currentUser.userId }, {
            title, content, excerpt
        })

        if(modifiedCount === 0) {
            const error = new Error('Not Authorized');
            error.status = 401;
            return next(error)
        }

        return res.status(200).json({ success: true })
    } catch(err) {
        return next(err)
    }
})

module.exports = router;