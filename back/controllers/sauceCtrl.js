const Sauce = require('../models/Sauce');
const fs = require('fs'); //file system

exports.getAllSauces =  (req, res) => {
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch(err => res.status(400).json({ err }))
}

exports.getOneSauce =  (req, res) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(err => res.status(400).json({ err }))
}

exports.createSauce =  (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save(function(err) {
        if(err) res.status(400).json({ message: err });
        res.status(200).json({ message: 'La sauce a bien été ajoutée !' });
    })
};

exports.updateSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
            if(!sauce) {
                res.status(404).json({
                    message: new Error('No such sauce !')
                });
            }

            if(sauce.userId !== req.auth.userId) {
                res.status(404).json({
                    message: new Error('Unauthorized request !')
                });
            }

            if(!req.file) {
                Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id})
                .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
            } 
            else {
                Sauce.findOne({ _id: req.params.id})
                .then(sauce => {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
                        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }));
                    })
                })
        }
    })
    .catch((error) => {
        res.status(400).json({
            message: error
        });
    })
};

exports.deleteSauce =  async (req, res) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.findOne({ _id: req.params.id}).then(
                (sauce) => {
                    if(!sauce) {
                        res.status(404).json({ message: "Id is not found !" });
                    }
        
                    if(sauce.userId !== req.auth.userId) {
                        res.status(400).json({
                            message: 'Unauthorized request !'
                        });
                    } else{
                        Sauce.deleteOne({ _id: req.params.id}).then(
                            () => {
                                res.status(200).json({ 
                                    message: 'Sauce was deleted !'
                                });
                            }
                        )
                    }
        
                }
            ).catch(
                (error) => {
                    res.status(404).json({ 
                        message: error
                    });
                }
            );
        })
    })
    .catch(error => res.status(500).json({ error }))
};

exports.evaluateSauce =  (req, res, next) => {
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
};