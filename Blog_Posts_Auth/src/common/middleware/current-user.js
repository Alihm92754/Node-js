const jwt = require('jsonwebtoken');

const currentUser = (req, res, next) => {
    try {
        const token = req.get('Authorization').split(' ')[1];
        if(!token) throw new Error();

        const payload = jwt.verify(token, 'secret_key')
        if(!payload) throw new Error();
        
        req.currentUser = payload;
        return next()
    } catch(err) {
        const error = new Error('Not Authorized');
        error.status = 401;
        return next(error)
    }
}

module.exports = currentUser;