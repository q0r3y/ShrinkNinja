'use strict';
const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const resController = require("../controllers/resController");

router.post('/shrink',
  // (req, res) => {
  //   console.log(req.body)
  //   console.log(`hit`);
  // },
  linkController.checkForLongUrl(),
  linkController.generateLink(),
  resController.sendShortLink()
);

router.all('*',
  resController.sendWebPage()
  // linkController.checkPathForUrl(),
  // linkController.generateLink(),
  // linkController.sendShortLink(),
);

module.exports = router;
