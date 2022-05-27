'use strict';
const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const resController = require("../controllers/resController");

router.post('/api',
  linkController.checkForWebUri(),
  linkController.generateLink(),
  resController.sendShortLink(),
);

router.all('*',
  resController.sendWebPage(),
);

module.exports = router;
