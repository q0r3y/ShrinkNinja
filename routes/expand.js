'use strict';
const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

router.all('*',
  async (req, res) => {
    const shortCode = req.originalUrl.slice(1);
    let link = await linkController.getLink(escape(shortCode));
    if (link) {
      res.redirect(link['longUrl']);
    } else {
      res.redirect(`http://shrink.ninja`);
    }
  }
);

module.exports = router;
