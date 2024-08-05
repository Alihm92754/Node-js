const express = require('express');
const BadRequestError = require('../../common/errors/bad-request-error');
const NotFoundError = require('../../common/errors/not-found-error');
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
        return next(new BadRequestError('post id is required'));
    }

    
    try {
        const post = await Post.findById(id)
        
        if(!post) throw new NotFoundError('Document not found')

        return res.status(200).json({ post })
    } catch(err) {
        return next(err)
    }

})

module.exports = router