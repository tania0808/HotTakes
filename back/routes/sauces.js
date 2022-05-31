const router = require('express').Router();
const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');
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




module.exports = router;
