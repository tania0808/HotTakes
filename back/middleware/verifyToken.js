const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = { userId: userId}

        if(req.auth.userId && req.auth.userId != userId) {
            throw 'User id non valable'
        } else {
            next();
        }
    }
    catch (error) {
        res.status(401).json({ error: 'Requete non authentifié !'})
    }
};
