const express = require('express');
const { check } = require('express-validator'); 
const validationRequest = require('../../common/middleware/validation-request');
const Ebook = require('../../models/ebook');
const uploadPdf = require('../../common/middleware/upload-pdf');
const User = require('../../models/user');

const route = express.Router();

route.post('/create', uploadPdf, check(['title', 'price'], 'title and price are required').notEmpty(), validationRequest, async (req, res, next) => {
    const { title, price, description } = req.body;

    try {
        if(!req.file) throw new BadRequestError('A PDF file is required!')

        const { filename } = req.file;

        const ebook = new Ebook({
            title,
            description,
            price,
            filename
        })
        await ebook.save();

        await User.findByIdAndUpdate({ _id: req.currentUser.userId },
            { $push: { ebooks: ebook._id } });

        res.status(200).json({ ebook })
    }
    catch(err) {
        next(err)
    }
})

module.exports = route;