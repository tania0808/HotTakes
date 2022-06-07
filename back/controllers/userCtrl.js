const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userValidation, passwordValidation } = require('../middleware/validation');

exports.userSignUp = async (req, res, next) => {
    // VALIDATE DATA BEFORE CREATING A USER
    const { error }  = userValidation(req.body);
    const isValidPassword = passwordValidation(req.body.password);
    
    if(!isValidPassword) return res.status(400).send({ message: "The string should have a minimum length of 6 characters, a minimum of 1 uppercase letter, a minimum of 2 digits, should not have spaces"});

    if(error) return res.status(400).send({ message: error.details[0].message});

    //CHECKING IF USER IS ALREADY IN THE DATABASE
    const emailExists = await User.findOne({ email: req.body.email});
    if(emailExists) return res.status(400).send({ message : 'Email already exists !'});

    // HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // CREATE A NEW USER
    const user = new User({
        email: req.body.email,
        password: hashedPassword
    });

    // SAVE USER
    try {
        await user.save();
        res.send({ message: "L'utilisateur a bien été crée !"});
    }

    // SEND AN ERROR
    catch(err){ res.status(400).send(err) }
};

exports.userLogIn =  async (req, res, next) => {

    // VALIDATE DATA BEFORE LOGGING IN
    const { error }  = userValidation(req.body);
    if(error) return res.status(400).send({ message: error.details[0].message});

    //CHECKING IF USER EMAIL EXISTS
    const userExists = await User.findOne({ email: req.body.email});
    if(!userExists) return res.status(400).send({message: 'Email is not found !'});

    //CHECKING IF PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, userExists.password);
    if(!validPass) return res.status(400).send({ message: 'Invalid password !'});

    // CREATE AND ASIGN A TOKEN
    const tokenB = jwt.sign({ _id: userExists._id }, process.env.TOKEN_SECRET)
    res.send({ userId: userExists._id, token: tokenB });
};