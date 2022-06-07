const router = require('express').Router();
const sauceCtrl = require('../controllers/sauceCtrl');

// Token verification
const auth = require('../middleware/verifyToken');

// Multer for images
const multer = require('../middleware/multer');

// Sauce routes
router.get('/', auth, sauceCtrl.getAllSauces);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.post('/', auth, multer, sauceCtrl.createSauce);

router.put('/:id', auth, multer, sauceCtrl.updateSauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', sauceCtrl.evaluateSauce );

module.exports = router;
