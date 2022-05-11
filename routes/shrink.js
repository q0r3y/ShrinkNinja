'use strict';
const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');

router.all('*',
  linkController.checkPathForUrl(),
  linkController.generateLink(),
  linkController.sendShortLink(),
);

module.exports = router;
