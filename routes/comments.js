const router = require('express').Router();
const Comment = require('../models/comments.model');

// The /comments/card/:cardid route for retrieving the comments for a specific card
// cardid is passed as a param in the url, cardid of currently selected card
router.route('/card/:cardid/:username/:userid')
  //retrieve all comments from the database
  .get(function(req, res) {
    // Find comments related to the selected card
    Comment.find({ cardId: req.params.cardid })
        .then(comments => res.json(comments))
        .catch(err => res.send(err));
  })
  // Post new comment to our database
  .post(function(req, res) {
    var comment = new Comment();
    (req.params.username) ? comment.author = req.params.username : null;
    (req.body.text) ? comment.text = req.body.text : null;
    (req.body.rating) ? comment.rating = req.body.rating : null;
    (req.params.cardid) ? comment.cardId = req.params.cardid : null;
    (req.params.userid) ? comment.authorId = req.params.userid : null;

    comment.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Comment successfully added!' });
    });
  });

// The /comments/card/:cardid/:comment_id route for updating/deleting the comments for a specific card
// cardid & comment_id is passed as a param in the url, cardid of currently selected card
router.route('/card/:cardid/:username/:userid/:comment_id')
// The put method allows us to update our comment based on the ID passed to the route for the specified card
  .put(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err)
        res.send(err);
      // Setting the new author, text and rating to whatever was changed. If nothing was changed
      // we will not alter the field.
      (req.params.username) ? comment.author = req.params.username : null;
      (req.body.text) ? comment.text = req.body.text : null;
      (req.body.rating) ? comment.rating = req.body.rating : null;
      (req.params.cardid) ? comment.cardId = req.params.cardid : null;
      (req.params.userid) ? comment.authorId = req.params.userid : null;
      // Overwrite our comment in the db
      comment.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Comment has been updated' });
      });
    });
  })
  // Delete method for removing a comment from the card
  .delete(function(req, res) {
    // Selects the comment by its ID, then removes it.
    Comment.deleteOne({ _id: req.params.comment_id }, function(err, comment) {
      if (err)
        res.send(err);
      res.json({ message: 'Comment has been deleted' })
    })
  });


module.exports = router;
