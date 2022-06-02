const router = require('express').Router();
const sauceCtrl = require('../controllers/sauceCtrl');


const Sauce = require('../models/Sauce');
const auth = require('../middleware/verifyToken');
const multer = require('../middleware/multer');

router.get('/', sauceCtrl.getAllSauces);

router.get('/:id', sauceCtrl.getOneSauce);

router.post('/', auth, multer, sauceCtrl.createSauce);

router.put('/:id', auth, multer, sauceCtrl.updateSauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', sauceCtrl.evaluateSauce );




module.exports = router;
