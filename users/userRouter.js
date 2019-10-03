const express = require("express");
const User = require("./userDb.js");

const router = express.Router();

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.get("/", (req, res) => {
  User.get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ error: "Error geting Users" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  User.getById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "This user id does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error geting Users" });
    });
});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const name = req.body;
  User.getById(id).then(user => {
    if (user) {
      User.update(id, { name }).then(updated => {
        res.status(200).json(updated);
      });
    } else {
      res.status(404).json({ error: "this user id does not exist" });
    }
  });
});

//custom middleware

function validateUserId(req, res, next) {}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
