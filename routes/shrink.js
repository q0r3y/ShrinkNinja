'use strict';
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const shrinkController = require('../controllers/shrinkController');
const resController = require("../controllers/resController");
const expandController = require("../controllers/expandController");

router.post('/api',
  body('shrinkUri')
    .exists({checkFalsy: true, checkNull: true,})
    .withMessage(' must be present')
    .notEmpty().withMessage(' must not be empty')
    .isURL().withMessage(' must be a valid URL'),
  resController.checkForErrors(),
  expandController.checkForShortUrl(),
  shrinkController.generateLink(),
  resController.sendShortLink(),
);

router.all('*',
  resController.sendWebPage(),
);

module.exports = router;
