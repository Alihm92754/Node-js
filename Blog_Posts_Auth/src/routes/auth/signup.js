const express = require('express');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const route = express.Router();

route.post('/signup', async (req, res ,next) => {
    const { userName, email, password } = req.body;

    if(!userName || !email || !password) {
        const error = new Error('All fields are required');
        error.status = 400;
        return next(error)
    }

    try {
        const user = new User({
            userName, email, password
        })

        await user.save()

        const token = jwt.sign(
            { email, userId: user._id }, 'secret_key', { expiresIn: '10h' })

        return res.status(200).json({ token })
    } catch(err) {
        return next(err)
    }
})

module.exports = route