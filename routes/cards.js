const router = require('express').Router();
let Card = require('../models/card.model');
const newCard = require('../models/newCard.model');

router.route('/:id').get((req, res) => {
    // Taking in logged in user id as a parameter
    // Return back cards that are not deleted and createdBy logged in user OR cards that are not deleted and are public
    Card.find({ $or: [ { activeFlag: "1", createdBy: req.params.id }, { activeFlag: "1", visibility: "public" } ] })
        .then(cards => res.send({allCards: cards}))
        .catch(err => res.status(400).json('[GET] | /cards/ | Error: ' + err));
});

router.route('/test').post((req, res) => {
    let card = new newCard({
        template: "Testing",
        name: "Testing",
        label: "Label",
        cardSet: "SET",
        createdBy: "Liam",
        visibility: "public",
        activeFlag: "1",
        body: {
            backgroundColor: "blue",
            margin: "5px",
            maxWidth: "200",
            borderRadius: "25",
            fontFamily: "test",
            minHeight: "test",
            boxShadow: "test",
        },
        front: {
            styles: [
                {
                    data: {
                        name: "Title",
                        styles: {
                          color: "black",
                          textAlign: "center",
                          width:"",
                          fontFamily:"",
                          display:"block",
                          backgroundColor:"",
                          borderRadius:"",
                          boxShadow:"",
                          text: 'Title'
                        }
                      }
                }
            ]
        },
        back: {
            styles: [
                {
                    data: {
                        name: "Title",
                        styles: {
                          color: "black",
                          textAlign: "center",
                          width:"",
                          fontFamily:"",
                          display:"block",
                          backgroundColor:"",
                          borderRadius:"",
                          boxShadow:"",
                          text: 'Title'
                        }
                      }
                }
            ]
        }
    })
    card.save()
        .then(() => res.json('[POST] | /cards/add | Card successfully added!'))
        .catch(err => res.status(400).json('[POST] | /cards/add | Error: ' + err));
});

router.route('/getest').post((req, res) => {
    // Taking in logged in user id as a parameter
    // Return back cards that are not deleted and createdBy logged in user OR cards that are not deleted and are public
    newCard.find({ $or: [ { visibility: "public" } ] })
        .then(cards => res.send({allCards: cards}))
        .catch(err => res.status(400).json('[GET] | /cards/ | Error: ' + err));
});

router.route('/add').post((req, res) => {
    // Creating a new card
    const newCard = new Card({
        template: req.body.template,
        name: req.body.name,
        label: req.body.name,
        cardSet: req.body.cardSet,
        createdBy: req.body.createdBy,
        visibility: req.body.visibility,
        activeFlag: req.body.activeFlag,
        styling: {
            card: {
                maxWidth: req.body.styling.card.maxWidth,
                textAlign: req.body.styling.card.textAlign,
                fontFamily: req.body.styling.card.fontFamily,
                display: req.body.styling.card.display,
                border: req.body.styling.card.border,
                backgroundColor: req.body.styling.card.backgroundColor,
                boxShadow: req.body.styling.card.boxShadow,
                margin: req.body.styling.card.margin,
                borderRadius: req.body.styling.card.borderRadius
            },
            cardTitle: {
                text: req.body.styling.cardTitle.text,
                fontSize: req.body.styling.cardTitle.fontSize,
                color: req.body.styling.cardTitle.color,
                textAlign: req.body.styling.cardTitle.textAlign,
                fontFamily: req.body.styling.cardTitle.fontFamily,
                display: req.body.styling.cardTitle.display,
                backgroundColor: req.body.styling.cardTitle.backgroundColor,
                borderRadius: req.body.styling.cardTitle.borderRadius
            },
            cardImg: {
                background: req.body.styling.cardImg.background,
                alt: req.body.styling.cardImg.alt,
                height: req.body.styling.cardImg.height,
                width: req.body.styling.cardImg.width,
                display: req.body.styling.cardImg.display,
                minHeight: req.body.styling.cardImg.minHeight,
                backgroundSize: req.body.styling.cardImg.backgroundSize,
                borderRadius: req.body.styling.cardImg.borderRadius
            },
            cardTitle2: {
                text: req.body.styling.cardTitle2.text,
                fontSize: req.body.styling.cardTitle2.fontSize,
                color: req.body.styling.cardTitle2.color,
                textAlign: req.body.styling.cardTitle2.textAlign,
                fontFamily: req.body.styling.cardTitle2.fontFamily,
                display: req.body.styling.cardTitle2.display,
                backgroundColor: req.body.styling.cardTitle2.backgroundColor,
                borderRadius: req.body.styling.cardTitle2.borderRadius
            },
            cardParagraph1: {
                text: req.body.styling.cardParagraph1.text,
                fontSize: req.body.styling.cardParagraph1.fontSize,
                fontFamily: req.body.styling.cardParagraph1.fontFamily,
                color: req.body.styling.cardParagraph1.color,
                padding: req.body.styling.cardParagraph1.padding,
                display: req.body.styling.cardParagraph1.display,
                border: req.body.styling.cardParagraph1.border,
                backgroundColor: req.body.styling.cardParagraph1.backgroundColor,
                borderRadius: req.body.styling.cardParagraph1.borderRadius
            },
            cardParagraph2: {
                text: req.body.styling.cardParagraph2.text,
                fontSize: req.body.styling.cardParagraph2.fontSize,
                fontFamily: req.body.styling.cardParagraph2.fontFamily,
                color: req.body.styling.cardParagraph2.color,
                padding: req.body.styling.cardParagraph2.padding,
                display: req.body.styling.cardParagraph2.display,
                border: req.body.styling.cardParagraph2.border,
                backgroundColor: req.body.styling.cardParagraph2.backgroundColor,
                borderRadius: req.body.styling.cardParagraph2.borderRadius
            },
            cardParagraph3: {
                text: req.body.styling.cardParagraph3.text,
                fontSize: req.body.styling.cardParagraph3.fontSize,
                fontFamily: req.body.styling.cardParagraph3.fontFamily,
                color: req.body.styling.cardParagraph3.color,
                padding: req.body.styling.cardParagraph3.padding,
                display: req.body.styling.cardParagraph3.display,
                border: req.body.styling.cardParagraph3.border,
                backgroundColor: req.body.styling.cardParagraph3.backgroundColor,
                borderRadius: req.body.styling.cardParagraph3.borderRadius
            },
            cardButton: {
                text: req.body.styling.cardButton.text,
                color: req.body.styling.cardButton.color,
                height: req.body.styling.cardButton.height,
                width: req.body.styling.cardButton.width,
                textAlign: req.body.styling.cardButton.textAlign,
                fontFamily: req.body.styling.cardButton.fontFamily,
                display: req.body.styling.cardButton.display,
                border: req.body.styling.cardButton.border,
                backgroundColor: req.body.styling.cardButton.backgroundColor,
                boxShadow: req.body.styling.cardButton.boxShadow,
                margin: req.body.styling.cardButton.margin,
                borderRadius: req.body.styling.cardButton.borderRadius
            }
        }
    });
    
    newCard.save()
        .then(() => res.json('[POST] | /cards/add | Card successfully added!'))
        .catch(err => res.status(400).json('[POST] | /cards/add | Error: ' + err));
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
    // Save current card changes and overwrite
    // Parameter is card Id
    Card.findById(req.params.id)
        .then(card => {
            card.template = req.body.template;
            card.name = req.body.name;
            card.label = req.body.name;
            card.cardSet = req.body.cardSet;
            card.createdBy = req.body.createdBy;
            card.visibility = req.body.visibility;
            card.activeFlag = req.body.activeFlag;

            card.styling.card.maxWidth = req.body.styling.card.maxWidth;
            card.styling.card.textAlign = req.body.styling.card.textAlign;
            card.styling.card.fontFamily = req.body.styling.card.fontFamily;
            card.styling.card.display = req.body.styling.card.display;
            card.styling.card.border = req.body.styling.card.border;
            card.styling.card.backgroundColor = req.body.styling.card.backgroundColor;
            card.styling.card.boxShadow = req.body.styling.card.boxShadow;
            card.styling.card.margin = req.body.styling.card.margin;
            card.styling.card.borderRadius = req.body.styling.card.borderRadius;

            card.styling.cardTitle.text = req.body.styling.cardTitle.text;
            card.styling.cardTitle.fontSize = req.body.styling.cardTitle.fontSize;
            card.styling.cardTitle.color = req.body.styling.cardTitle.color;
            card.styling.cardTitle.textAlign = req.body.styling.cardTitle.textAlign;
            card.styling.cardTitle.fontFamily = req.body.styling.cardTitle.fontFamily;
            card.styling.cardTitle.display = req.body.styling.cardTitle.display;
            card.styling.cardTitle.backgroundColor = req.body.styling.cardTitle.backgroundColor;
            card.styling.cardTitle.borderRadius = req.body.styling.cardTitle.borderRadius;

            card.styling.cardImg.background = req.body.styling.cardImg.background;
            card.styling.cardImg.alt = req.body.styling.cardImg.alt;
            card.styling.cardImg.height = req.body.styling.cardImg.height;
            card.styling.cardImg.width = req.body.styling.cardImg.width;
            card.styling.cardImg.display = req.body.styling.cardImg.display;
            card.styling.cardImg.minHeight = req.body.styling.cardImg.minHeight;
            card.styling.cardImg.backgroundSize = req.body.styling.cardImg.backgroundSize;
            card.styling.cardImg.borderRadius = req.body.styling.cardImg.borderRadius;

            card.styling.cardTitle2.text = req.body.styling.cardTitle2.text;
            card.styling.cardTitle2.fontSize = req.body.styling.cardTitle2.fontSize;
            card.styling.cardTitle2.color = req.body.styling.cardTitle2.color;
            card.styling.cardTitle2.textAlign = req.body.styling.cardTitle2.textAlign;
            card.styling.cardTitle2.fontFamily = req.body.styling.cardTitle2.fontFamily;
            card.styling.cardTitle2.display = req.body.styling.cardTitle2.display;
            card.styling.cardTitle2.backgroundColor = req.body.styling.cardTitle2.backgroundColor;
            card.styling.cardTitle2.borderRadius = req.body.styling.cardTitle2.borderRadius;

            card.styling.cardParagraph1.text = req.body.styling.cardParagraph1.text;
            card.styling.cardParagraph1.fontSize = req.body.styling.cardParagraph1.fontSize;
            card.styling.cardParagraph1.fontFamily = req.body.styling.cardParagraph1.fontFamily;
            card.styling.cardParagraph1.color = req.body.styling.cardParagraph1.color;
            card.styling.cardParagraph1.padding = req.body.styling.cardParagraph1.padding;
            card.styling.cardParagraph1.display = req.body.styling.cardParagraph1.display;
            card.styling.cardParagraph1.border = req.body.styling.cardParagraph1.border;
            card.styling.cardParagraph1.backgroundColor = req.body.styling.cardParagraph1.backgroundColor;
            card.styling.cardParagraph1.borderRadius = req.body.styling.cardParagraph1.borderRadius;

            card.styling.cardParagraph2.text = req.body.styling.cardParagraph2.text;
            card.styling.cardParagraph2.fontSize = req.body.styling.cardParagraph2.fontSize;
            card.styling.cardParagraph2.fontFamily = req.body.styling.cardParagraph2.fontFamily;
            card.styling.cardParagraph2.color = req.body.styling.cardParagraph2.color;
            card.styling.cardParagraph2.padding = req.body.styling.cardParagraph2.padding;
            card.styling.cardParagraph2.display = req.body.styling.cardParagraph2.display;
            card.styling.cardParagraph2.border = req.body.styling.cardParagraph2.border;
            card.styling.cardParagraph2.backgroundColor = req.body.styling.cardParagraph2.backgroundColor;
            card.styling.cardParagraph2.borderRadius = req.body.styling.cardParagraph2.borderRadius;

            card.styling.cardParagraph3.text = req.body.styling.cardParagraph3.text;
            card.styling.cardParagraph3.fontSize = req.body.styling.cardParagraph3.fontSize;
            card.styling.cardParagraph3.fontFamily = req.body.styling.cardParagraph3.fontFamily;
            card.styling.cardParagraph3.color = req.body.styling.cardParagraph3.color;
            card.styling.cardParagraph3.padding = req.body.styling.cardParagraph3.padding;
            card.styling.cardParagraph3.display = req.body.styling.cardParagraph3.display;
            card.styling.cardParagraph3.border = req.body.styling.cardParagraph3.border;
            card.styling.cardParagraph3.backgroundColor = req.body.styling.cardParagraph3.backgroundColor;
            card.styling.cardParagraph3.borderRadius = req.body.styling.cardParagraph3.borderRadius;

            card.styling.cardButton.text = req.body.styling.cardButton.text;
            card.styling.cardButton.color = req.body.styling.cardButton.color;
            card.styling.cardButton.height = req.body.styling.cardButton.height;
            card.styling.cardButton.width = req.body.styling.cardButton.width;
            card.styling.cardButton.textAlign = req.body.styling.cardButton.textAlign;
            card.styling.cardButton.fontFamily = req.body.styling.cardButton.fontFamily;
            card.styling.cardButton.display = req.body.styling.cardButton.display;
            card.styling.cardButton.border = req.body.styling.cardButton.border;
            card.styling.cardButton.backgroundColor = req.body.styling.cardButton.backgroundColor;
            card.styling.cardButton.boxShadow = req.body.styling.cardButton.boxShadow;
            card.styling.cardButton.margin = req.body.styling.cardButton.margin;
            card.styling.cardButton.borderRadius = req.body.styling.cardButton.borderRadius;

            card.save()
                .then(() => res.json('[POST] | /cards/update/:id | Card successfully updated!'))
                .catch(err => res.status(400).json('[POST] | /cards/update/:id | Saving Error: ' + err));
        })
        .catch(err => res.status(400).json('[POST] | /cards/update/:id | Error: ' + err));
});

router.route('/delete/:id').post((req, res) => {
    // Soft delete for cards, changing flag to 0
    // Parameter is card Id
    Card.findById(req.params.id)
        .then(card => {          
            card.template = req.body.template;
            card.name = req.body.name;
            card.label = req.body.name;
            card.cardSet = req.body.cardSet;
            card.createdBy = req.body.createdBy;
            card.visibility = req.body.visibility;
            card.activeFlag = req.body.activeFlag;

            card.styling.card.maxWidth = req.body.styling.card.maxWidth;
            card.styling.card.textAlign = req.body.styling.card.textAlign;
            card.styling.card.fontFamily = req.body.styling.card.fontFamily;
            card.styling.card.display = req.body.styling.card.display;
            card.styling.card.border = req.body.styling.card.border;
            card.styling.card.backgroundColor = req.body.styling.card.backgroundColor;
            card.styling.card.boxShadow = req.body.styling.card.boxShadow;
            card.styling.card.margin = req.body.styling.card.margin;
            card.styling.card.borderRadius = req.body.styling.card.borderRadius;

            card.styling.cardTitle.text = req.body.styling.cardTitle.text;
            card.styling.cardTitle.fontSize = req.body.styling.cardTitle.fontSize;
            card.styling.cardTitle.color = req.body.styling.cardTitle.color;
            card.styling.cardTitle.textAlign = req.body.styling.cardTitle.textAlign;
            card.styling.cardTitle.fontFamily = req.body.styling.cardTitle.fontFamily;
            card.styling.cardTitle.display = req.body.styling.cardTitle.display;
            card.styling.cardTitle.backgroundColor = req.body.styling.cardTitle.backgroundColor;
            card.styling.cardTitle.borderRadius = req.body.styling.cardTitle.borderRadius;

            card.styling.cardImg.background = req.body.styling.cardImg.background;
            card.styling.cardImg.alt = req.body.styling.cardImg.alt;
            card.styling.cardImg.height = req.body.styling.cardImg.height;
            card.styling.cardImg.width = req.body.styling.cardImg.width;
            card.styling.cardImg.display = req.body.styling.cardImg.display;
            card.styling.cardImg.minHeight = req.body.styling.cardImg.minHeight;
            card.styling.cardImg.backgroundSize = req.body.styling.cardImg.backgroundSize;
            card.styling.cardImg.borderRadius = req.body.styling.cardImg.borderRadius;

            card.styling.cardTitle2.text = req.body.styling.cardTitle2.text;
            card.styling.cardTitle2.fontSize = req.body.styling.cardTitle2.fontSize;
            card.styling.cardTitle2.color = req.body.styling.cardTitle2.color;
            card.styling.cardTitle2.textAlign = req.body.styling.cardTitle2.textAlign;
            card.styling.cardTitle2.fontFamily = req.body.styling.cardTitle2.fontFamily;
            card.styling.cardTitle2.display = req.body.styling.cardTitle2.display;
            card.styling.cardTitle2.backgroundColor = req.body.styling.cardTitle2.backgroundColor;
            card.styling.cardTitle2.borderRadius = req.body.styling.cardTitle2.borderRadius;

            card.styling.cardParagraph1.text = req.body.styling.cardParagraph1.text;
            card.styling.cardParagraph1.fontSize = req.body.styling.cardParagraph1.fontSize;
            card.styling.cardParagraph1.fontFamily = req.body.styling.cardParagraph1.fontFamily;
            card.styling.cardParagraph1.color = req.body.styling.cardParagraph1.color;
            card.styling.cardParagraph1.padding = req.body.styling.cardParagraph1.padding;
            card.styling.cardParagraph1.display = req.body.styling.cardParagraph1.display;
            card.styling.cardParagraph1.border = req.body.styling.cardParagraph1.border;
            card.styling.cardParagraph1.backgroundColor = req.body.styling.cardParagraph1.backgroundColor;
            card.styling.cardParagraph1.borderRadius = req.body.styling.cardParagraph1.borderRadius;

            card.styling.cardParagraph2.text = req.body.styling.cardParagraph2.text;
            card.styling.cardParagraph2.fontSize = req.body.styling.cardParagraph2.fontSize;
            card.styling.cardParagraph2.fontFamily = req.body.styling.cardParagraph2.fontFamily;
            card.styling.cardParagraph2.color = req.body.styling.cardParagraph2.color;
            card.styling.cardParagraph2.padding = req.body.styling.cardParagraph2.padding;
            card.styling.cardParagraph2.display = req.body.styling.cardParagraph2.display;
            card.styling.cardParagraph2.border = req.body.styling.cardParagraph2.border;
            card.styling.cardParagraph2.backgroundColor = req.body.styling.cardParagraph2.backgroundColor;
            card.styling.cardParagraph2.borderRadius = req.body.styling.cardParagraph2.borderRadius;

            card.styling.cardParagraph3.text = req.body.styling.cardParagraph3.text;
            card.styling.cardParagraph3.fontSize = req.body.styling.cardParagraph3.fontSize;
            card.styling.cardParagraph3.fontFamily = req.body.styling.cardParagraph3.fontFamily;
            card.styling.cardParagraph3.color = req.body.styling.cardParagraph3.color;
            card.styling.cardParagraph3.padding = req.body.styling.cardParagraph3.padding;
            card.styling.cardParagraph3.display = req.body.styling.cardParagraph3.display;
            card.styling.cardParagraph3.border = req.body.styling.cardParagraph3.border;
            card.styling.cardParagraph3.backgroundColor = req.body.styling.cardParagraph3.backgroundColor;
            card.styling.cardParagraph3.borderRadius = req.body.styling.cardParagraph3.borderRadius;

            card.styling.cardButton.text = req.body.styling.cardButton.text;
            card.styling.cardButton.color = req.body.styling.cardButton.color;
            card.styling.cardButton.height = req.body.styling.cardButton.height;
            card.styling.cardButton.width = req.body.styling.cardButton.width;
            card.styling.cardButton.textAlign = req.body.styling.cardButton.textAlign;
            card.styling.cardButton.fontFamily = req.body.styling.cardButton.fontFamily;
            card.styling.cardButton.display = req.body.styling.cardButton.display;
            card.styling.cardButton.border = req.body.styling.cardButton.border;
            card.styling.cardButton.backgroundColor = req.body.styling.cardButton.backgroundColor;
            card.styling.cardButton.boxShadow = req.body.styling.cardButton.boxShadow;
            card.styling.cardButton.margin = req.body.styling.cardButton.margin;
            card.styling.cardButton.borderRadius = req.body.styling.cardButton.borderRadius;

            card.save()
                .then(() => res.json('[POST] | /cards/delete/:id | Card successfully deleted!'))
                .catch(err => res.status(400).json('[POST] | /cards/delete/:id | Error: ' + err));
        })
        .catch(err => res.status(400).json('[POST] | /cards/delete/:id | Error: ' + err));
});

module.exports = router;
