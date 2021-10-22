const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Schema
const CommentsSchema = new Schema({
    author: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    rating: {
        type: Number,
        required: true
    },
    cardId: {
      type: String,
      required: true
    },
    authorId: {
      type: String,
      required: true
    }
  });

const Comments = mongoose.model('Comments', CommentsSchema);

module.exports = Comments;