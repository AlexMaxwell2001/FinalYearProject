const router = require('express').Router();
const newCard = require('../models/newCard.model');

router.route('/:id').get((req, res) => {
    // Taking in logged in user id as a parameter
    // Return back cards that are not deleted and createdBy logged in user OR cards that are not deleted and are public
    newCard.find({ $or: [ { activeFlag: "1", createdBy: req.params.id }, { activeFlag: "1", createdBy: "root" } ] })
        .then(cards => res.send({allCards: cards}))
        .catch(err => res.status(400).json('[GET] | /cards/ | Error: ' + err));
});

router.route('/add').post((req, res) => {
    let reqCard = req.body.card;
    delete reqCard._id
    let card = new newCard({ 
        ...reqCard, "_id": undefined
    })
    card.set({_id: undefined})
    card._id = undefined;
    card.save()
        .then((updated) => res.json({updated}))
        .catch(err => console.log(err));
});

router.route('/template/:id').get((req, res) => {
    // Taking in logged in user id as a parameter
    // Return back cards that are not deleted and createdBy logged in user OR cards that are not deleted and are public
    newCard.find({ $or: [ { _id: req.body.id } ] })
        .then(card => res.send({...card}))
        .catch(err => res.status(400).json('[GET] | /cards/ | Error: ' + err));
});

/*
 * Old hard delete route
 */
// router.route('/:id').delete((req, res) => {
//     Card.findByIdAndDelete(req.params.id)
//         .then(() => res.json('[DELETE] | /cards/:id | Card successfully deleted!'))
//         .catch(err => res.status(400).json('[DELETE] | /cards/:id | Error: ' + err));
// });

router.route('/update/:id').post((req, res) => {
    console.log(req.body.card.body);
    newCard.findById(req.body.id)
        .then(_ => {
            newCard.updateOne({_id: req.body.card._id}, {...req.body.card})
                .then(() => res.json('[POST] | /cards/update/:id | Card successfully updated!'))
                .catch(err => res.json('[POST] | /cards/update/:id | Saving Error: ' + err));
        })
        .catch(err => res.json('[POST] | /cards/update/:id | Error: ' + err));
});

router.route('/find/:search').post((req, res) => {
    newCard.find({...req.body.search})
        .then(cards => res.send({cards}))
        .catch(err => res.json('[POST] | /cards/update/:id | Error: ' + err));
});

router.route('/get/:id').get((req, res) => {
    newCard.find({_id: req.params.id })
        .then(cards => res.send({allCards: cards}))
        .catch(err => res.status(400).json('[GET] | /cards/ | Error: ' + err));
});

router.route('/delete/:id').post((req, res) => {
    newCard.deleteOne({_id: req.body.id})
        .then(() => res.json('[POST] | /cards/delete/:id | Card successfully updated!'))
        .catch(err => console.log(err));
});

module.exports = router;
