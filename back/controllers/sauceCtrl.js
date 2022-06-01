const Sauce = require('../models/Sauce');

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

exports.updateSauce =  (req, res, next) => {
    if(!req.file) {
        Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(err => res.status(400).json({ error }));
    } else {
        Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(err => res.status(400).json({ error }));

    }
};

exports.deleteSauce =  async (req, res) => {
    try{
        const sauceToDelete = await Sauce.findByIdAndDelete(req.params.id);
        if(!sauceToDelete) return res.status(404).json({ message: "Id is not found !" });
        res.status(200).json({ message: 'Sauce was deleted !'});
    }
    catch(err) {
        res.status(404).json({ message: err });
    }
};
