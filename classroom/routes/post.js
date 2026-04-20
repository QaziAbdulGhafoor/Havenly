const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("all posts");
});

module.exports = router;
