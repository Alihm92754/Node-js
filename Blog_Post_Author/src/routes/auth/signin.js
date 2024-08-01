const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../../models/user')

const route = express.Router()

route.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        const error = new Error('All fields are required');
        error.status = 400;
        return next(error);
    }

    try{
        const user = await User.findOne({ email })
        if(!user) {
            const error = new Error('wrong credentials');
            error.status = 401;
            return next(error);
        }

        const pwdEqual = await bcrypt.compare(password, user.password)

        if(!pwdEqual) {
            const error = new Error('wrong credentials');
            error.status = 401;
            return next(error);
        }

        const token = jwt.sign(
            { email, userId: user._id }, 'secret_key', { expiresIn: '10h' })

        res.status(200).json({ token })
    } catch(err) {
        return next(err)
    }
})

module.exports = route