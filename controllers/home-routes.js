const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

router.get("/", (req, res) => {
  console.log(req.session);
  Post.findAll({
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        // Sequelize provides us with a special method called .literal() that allows us
        // to run regular SQL queries from within the Sequelize method-based queries.
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      // We need the entire array of posts to be in the template. That also means we'll need to serialize the entire array.
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      // console.log(dbPostData[0]); --testing one post information
      // res.render("homepage", dbPostData[0].get({ plain: true })); --pass a single post object into the homepage template
      // If you want to get just the data with your attributes as keys, use get({plain: true})
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      });
      // above adds the array to an object and continue passing an object to the template.
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// render login screen
router.get("/login", (req, res) => {
  // check for a session and redirect to the homepage if one exists
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
