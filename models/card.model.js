//BASED ON MOCK OBJECT 3, STILL HAVE TO CHANGE STRUCTURE OF IT AND COMPARE IT TO THE UI DUE TO HOW ALL CREATED OBJECTS ARE DIFFERENT
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var cardBodySchema = new mongoose.Schema({
    maxWidth: { type: String },
    textAlign: { type: String },
    fontFamily: { type: String },
    display: { type: String },
    border: { type: String },
    backgroundColor: { type: String },
    boxShadow: { type: String },
    margin: { type: String },
    borderRadius: { type: String }
})

var cardTitleSchema = new mongoose.Schema({
    text: { type: String },
    fontSize: { type: String },
    color: { type: String },
    textAlign: { type: String },
    fontFamily: { type: String },
    display: { type: String },
    backgroundColor: { type: String },
    borderRadius: { type: String }
})

var cardImgSchema = new mongoose.Schema({
    background: { type: String },
    alt: { type: String },
    height: { type: String },
    width: { type: String },
    display: { type: String },
    minHeight: { type: String },
    backgroundSize: { type: String },
    borderRadius: { type: String }
})

var cardTitle2Schema = new mongoose.Schema({
    text: { type: String },
    fontSize: { type: String },
    color: { type: String },
    textAlign: { type: String },
    fontFamily: { type: String },
    display: { type: String },
    backgroundColor: { type: String },
    borderRadius: { type: String }
})

var cardParagraph1Schema = new mongoose.Schema({
    text: { type: String },
    fontSize: { type: String },
    fontFamily: { type: String },
    color: { type: String },
    padding: { type: String },
    display: { type: String },
    border: { type: String },
    backgroundColor: { type: String },
    borderRadius: { type: String }
})

var cardParagraph2Schema = new mongoose.Schema({
    text: { type: String },
    fontSize: { type: String },
    fontFamily: { type: String },
    color: { type: String },
    padding: { type: String },
    display: { type: String },
    border: { type: String },
    backgroundColor: { type: String },
    borderRadius: { type: String }
})

var cardParagraph3Schema = new mongoose.Schema({
    text: { type: String },
    fontSize: { type: String },
    fontFamily: { type: String },
    color: { type: String },
    padding: { type: String },
    display: { type: String },
    border: { type: String },
    backgroundColor: { type: String },
    borderRadius: { type: String }
})

var cardButtonSchema = new mongoose.Schema({
    text: { type: String },
    color: { type: String },
    height: { type: String },
    width: { type: String },
    textAlign: { type: String },
    fontFamily: { type: String },
    display: { type: String },
    border: { type: String },
    backgroundColor: { type: String },
    boxShadow: { type: String },
    margin: { type: String },
    borderRadius: { type: String },
    padding: { type: String, default: '12px' },
    fontSize: { type: String, default: '18px' }
})

var styleSchema = new mongoose.Schema({
    card: cardBodySchema,
    cardTitle: cardTitleSchema,
    cardImg: cardImgSchema,
    cardTitle2: cardTitle2Schema,
    cardParagraph1: cardParagraph1Schema,
    cardParagraph2: cardParagraph2Schema,
    cardParagraph3: cardParagraph3Schema,
    cardButton: cardButtonSchema
})

const cardSchema = new Schema({
    template: { type: String, default: 'Product Card' },
    name: { type: String, required: true },
    label: { type: String, required: true },
    cardSet: { type: String, required: true},
    createdBy: { type: String, required: true },
    visibility: { type: String, default: 'private' },
    activeFlag: { type: String, default: '1' },
    styling: styleSchema
}, {
    timestamps: true,
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;