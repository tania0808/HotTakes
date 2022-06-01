const router = require('express').Router();
const sauceCtrl = require('../controllers/sauceCtrl');


const Sauce = require('../models/Sauce');
const auth = require('../middleware/verifyToken');
const multer = require('../middleware/multer');

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

router.get('/', sauceCtrl.getAllSauces);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.post('/', auth, multer, sauceCtrl.createSauce);

router.put('/:id', auth, multer, sauceCtrl.updateSauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then( sauce => {
        if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1)
        {
                Sauce.updateOne({ _id: req.params.id}, { $inc : {likes : 1}, $addToSet: { usersLiked: req.body.userId }})
                .then(res.status(200).json({ message: 'Liked !' }))
                .catch(err => res.status(400).json({ message: err}))
        }
        else if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0){
                Sauce.updateOne({ _id: req.params.id}, { $inc : { likes : -1 }, $pull: { usersLiked: req.body.userId  }})
                .then(res.status(200).json({ message: 'Like is gone !' }))
                .catch(err => console.log(err))
        }
        else if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){
                Sauce.updateOne({ _id: req.params.id}, { $inc : { dislikes : 1 }, $addToSet: { usersDisliked: req.body.userId }})
                .then(res.status(200).json({ message: 'Disliked !' }))
                .catch(err => console.log(err))
        }
        else if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){
                Sauce.updateOne({ _id: req.params.id}, { $inc : { dislikes : -1 }, $pull: { usersDisliked: req.body.userId }})
                .then(res.status(200).json({ message: 'Dislike is gone !' }))
                .catch(err => console.log(err))
        }
    })
    .catch(err => res.status(400).json({ message: err }));
})




module.exports = router;
