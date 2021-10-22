//BASED ON MOCK OBJECT 3, STILL HAVE TO CHANGE STRUCTURE OF IT AND COMPARE IT TO THE UI DUE TO HOW ALL CREATED OBJECTS ARE DIFFERENT
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
    template: { type: String, default: 'Product Card' },
    name: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    cardSet: { type: String, required: true},
    createdBy: { type: String, required: true },
    gridEnabled: {type: Boolean, required: true},
    container : {
        backgroundColor: { type: String },
        margin: { type: String },
        width: {type: String},
        height: {type: String},
        padding: {type: String},
        maxHeight: { type: String },
        padding: {type: String},
        border: {type: String},
        maxWidth: { type: String },
        borderRadius: { type: String },
        textAlign: {type: String},
        fontFamily: { type: String },
        minHeight: { type: String },
        boxShadow: { type: String },
        display: {type: String},
        backgroundImage: {type: String},
        backgroundSize: {type: String},
        backgroundRepeat: {type: String},
    },
    visibility: { type: String, default: 'private' },
    activeFlag: { type: String, default: '1' },
    cards : [Schema.Types.Mixed],
    backEnabled: { type: Boolean },
    frontTrigger: { id: { type: Number }  },
    backTrigger: { id: { type: Number } },
    flipDirection: { type: String},
    body: {
        backgroundColor: { type: String },
        margin: { type: String },
        width: {type: String},
        height: {type: String},
        padding: {type: String},
        maxHeight: { type: String },
        padding: {type: String},
        border: {type: String},
        maxWidth: { type: String },
        borderRadius: { type: String },
        textAlign: {type: String},
        fontFamily: { type: String },
        minHeight: { type: String },
        boxShadow: { type: String },
        display: {type: String},
        position: {type: String},
        background: {type: String},
        backgroundImage: {type: String},
        backgroundSize: {type: String},
        backgroundRepeat: {type: String},
        backdropFilter: {type: String}
    },
    front: {
        styles: [Schema.Types.Mixed],
        advancedStyles: [Schema.Types.Mixed],
    },
    back: {
        styles: [Schema.Types.Mixed],
        advancedStyles: [Schema.Types.Mixed],
    }
}, {
    timestamps: true,
});

const newCard = mongoose.model('newCard', cardSchema);

module.exports = newCard;