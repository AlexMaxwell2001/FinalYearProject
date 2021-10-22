//BASED ON MOCK OBJECT 3, STILL HAVE TO CHANGE STRUCTURE OF IT AND COMPARE IT TO THE UI DUE TO HOW ALL CREATED OBJECTS ARE DIFFERENT
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const setSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    createdBy: { type: String, required: true },
    visibility: { type: String, default: 'private' },
    activeFlag: { type: String, default: '1' },
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
    cards : {type: [Schema.Types.Mixed], required: true},
}, {
    timestamps: true,
});

const set = mongoose.model('cardSets', setSchema);

module.exports = set;