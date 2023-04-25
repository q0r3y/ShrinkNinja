'use strict';
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const shrinkController = require('../controllers/shrinkController');
const resController = require('../controllers/resController');

router.post(
  '/api',
  body('longUrl')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(' must be present')
    .notEmpty()
    .withMessage(' must not be empty')
    .isURL({ require_protocol: true })
    .withMessage(' must be a valid URL'),
  body('singleUse')
    .optional()
    .isBoolean()
    .withMessage(' must be a boolean value'),
  checkForErrors(),
  shrinkController.handleNinLink(),
  shrinkController.generateLink(),
  resController.sendShortLink()
);

router.all('*', resController.sendWebPage());

function checkForErrors() {
  return async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  };
}

module.exports = router;
