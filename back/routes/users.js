const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');


router.post('/signup', userCtrl.userSignUp);

router.post('/login', userCtrl.userLogIn);

module.exports = router;

