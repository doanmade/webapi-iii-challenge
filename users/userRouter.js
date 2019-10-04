const express = require("express");
const User = require("./userDb.js");
const Post = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const user = req.body;

  User.insert(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error inserting user" });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const post = req.body;
  Post.insert(post)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error adding post" });
    });
});

router.get("/", (req, res) => {
  User.get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ errMessage: "Error geting Users" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;
  User.getUserPosts(id);
  res
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error getting post" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  User.remove(id)
    .then(() => {
      res
        .status(204)
        .json({
          message: `The user with id ${id} has been removed from the server`
        })
        .end();
    })
    .catch(err => {
      console.log("err", err);
      res.status(500).json({
        errMessage: `There was an issue when deleting user with the id of ${id}!! They just wont die!!`
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  User.update(id, { name })
    .then(updated => {
      if (updated) {
        User.getById(id)
          .then(user => {
            res.status(200).json(user);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Error getting user" });
          });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error Updating user" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ error: "this user id does not exist" });
    }
  });
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ errMessage: "a User has no name" });
  }
  if (typeof name !== "string") {
    return res
      .status(400)
      .json({ errMessage: "a User's name must contain letters" });
  }
  next();
}

function validatePost(req, res, next) {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ errMessage: "a User has no text" });
  }
  if (typeof text !== "string") {
    return res
      .status(400)
      .json({ errMessage: "a User's text must contain letters" });
  }
  next();
}

module.exports = router;
