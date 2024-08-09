const express = require('express');
const { check } = require('express-validator');
const BadRequestError = require('../../common/errors/bad-request-error');
const uploadImg = require('../../common/middleware/upload-img');
const validationRequest = require('../../common/middleware/validation-request');
const { getSocketIO } = require('../../socketIo');

const Post = require('../../models/post')

const router = express.Router()

router.post('/create',  uploadImg,
    check(['title', 'content', 'excerpt'], 'all fields are required')
    .notEmpty()

, validationRequest, async (req, res, next) => {
    const { title, content, excerpt } = req.body

    const io = getSocketIO()

    
    try {

        if(req.file) {
            const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

            const post = new Post({
                title, imageUrl, content, excerpt, user: req.currentUser.userId
            });

            await post.save()

            io.emit('new-post', { postId: post._id, title: post.title })

            res.status(200).json({ post })
        } else {
            throw new BadRequestError('post image is required. Only PNG and JPEG file types are supported')
        }

    } catch(err) {
        return next(err)
    }

})

module.exports = router