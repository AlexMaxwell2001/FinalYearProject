//BASED ON MOCK OBJECT 3, STILL HAVE TO CHANGE STRUCTURE OF IT AND COMPARE IT TO THE UI DUE TO HOW ALL CREATED OBJECTS ARE DIFFERENT
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const setSchema = new Schema({
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
    cardSet: { type: String },
    responsive: { type: Boolean },
    min_width: { type: String },
    row_spacing: { type: String },
    col_spacing: { type: String },
    arrangementType: { type: String },
    grid: {type: [Schema.Types.Mixed]},
}, {
    timestamps: true,
});

const set = mongoose.model('arrangements', setSchema);

module.exports = set;