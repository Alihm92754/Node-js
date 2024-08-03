const express = require('express');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../../models/user')


const route = express.Router();

const validators = [
    check('email')
        .isEmail()
        .withMessage('Invalid Email')
        .custom(async (value, {req}) => {
            const user = await User.findOne({ email: value})
            if(user) throw new Error('A user with the same email address is already exists')

            return true    

        }),
    check('password')
        .isLength({ min: 6, max: 15})
        .withMessage('Password must be between 6 and 15 characters')
        .isAlphanumeric()
        .withMessage('Password must be alphanumeric (consisting of both letters and number)'),

    check('userName')
        .not()
        .isUppercase()
        .withMessage('Username cannot contain uppercase letters')
]

route.post('/signup', validators, async (req, res ,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error(errors.array()[0].msg)
            error.status = 400;
            return next(error);
        }
    
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
    
            req.session = { token }
    
            return res.status(200).json({ user })
        } catch(err) {
            return next(err)
        }
    })
    
module.exports = route
        