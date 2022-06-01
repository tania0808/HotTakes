const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken._id;
    req.auth = { userId };
    try {    
        if(req.body.userId && req.body.userId !== userId) {
            throw 'User id non valable';
        } else {
            next();
        }
    }
    catch(err) {
        res.status(401).json({ message: err})
    }
};
