'use strict';
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/linkController');

router.all('*',
  async (req, res) => {
    const shortCode = req.originalUrl.slice(1);
    let link = await urlController.getLink(escape(shortCode));
    if (link) {
      res.redirect(link['longUrl']);
    } else {
      res.status(400).json({'usage': 'usage page'});
    }
  }
);

module.exports = router;
