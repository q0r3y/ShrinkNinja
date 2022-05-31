'use strict';
const express = require('express');
const router = express.Router();
const {expandLink} = require("../controllers/expandController");

router.all('*',
  async (req, res) => {
    const shortCode = req.originalUrl.slice(1);
    let link = await expandLink(shortCode);
    if (link) {
      res.redirect(link['longUrl']);
    } else {
      res.redirect(`https://shrink.ninja`);
    }
  }
);

module.exports = router;
