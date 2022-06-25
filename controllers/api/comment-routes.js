const router = require('express').Router();
const { Comment } = require('../../models');

router.get('/', (req, res) => {
  // do not need to include any User or Post data with the GET. 
  // A simple Comment.findAll() will suffice.
  Comment.findAll()
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  // expects => {comment_text: "This is the comment", user_id: 1, post_id: 2}
  Comment.create({
    comment_text: req.body.comment_text,
    user_id: req.body.user_id,
    post_id: req.body.post_id,
  })
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// delete comment
router.delete("/:id", (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((dbCommentData) => {
    if (dbCommentData) {
      res.status(404).json({ message: 'No comment found'});
      return;
    }
    res.json(dbCommentData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;
