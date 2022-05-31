const router = require('express').Router();
const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

const Sauce = require('../models/Sauce');
const auth = require('../middleware/verifyToken');
const multer = require('../middleware/multer');

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

router.get('/', (req, res) => {
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch(err => res.status(400).json({err}))
});

router.get('/:id', auth,  (req, res) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(err => res.status(400).json({err}))
});


router.post('/', auth, multer, (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });


    // sauce.userId = req.body.userId,
    // sauce.name = req.body.name,
    // sauce.manufacturer = req.body.manufacturer,
    // sauce.description = req.body.description,
    // sauce.mainPepper = req.body.mainPepper,
    // sauce.heat = req.body.heat,
    // sauce.likes = 0,
    // sauce.dislikes = 0,
    // sauce.usersLiked =  [],
    // sauce.usersDisliked = [];
    


    sauce.save(function(err) {
        if(err) {
            res.send(err);
        }
        res.send('La sauce a bien été ajoutée !');
    })
});




module.exports = router;
