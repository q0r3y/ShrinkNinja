'use strict';
const express = require('express');
const router = express.Router();
const linkController = require("../controllers/linkController");
const db = require("../models/database");

router.all('*',
  async (req, res) => {
    const shortCode = req.originalUrl.slice(1);
    let link = await db.getLink(shortCode);
    if (link) {
      await linkController.triggered(link);
      res.redirect(link['longUrl']);
    } else {
      res.redirect(`https://shrink.ninja`);
    }
  }
);

module.exports = router;
