'use strict';
const db = require('../models/database');
const resController = require('./resController');

function generateLink() {
  return async (req, res, next) => {
    generateShortCode()
      .then((shortCode) => {
        const newLink = db.newLink(shortCode, req.body['shrinkUri']);
        newLink.save()
          .then(() => {
            res.locals['newLink'] = newLink;
            next();
          })
          .catch((err) => {
            console.log(`[-] Error: ${err}`);
            resController.error(res, 418);
          });
      })
      .catch((err) => {
        console.log(`[-] Error: ${err}`);
        resController.error(res, 409, err);
      });
  }
}

async function generateShortCode() {
  let attempt = 1;
  let codeLength = 4;
  let shortCode = Math.random().toString(36).substr(2, codeLength);
  while (await db.isCodeInUse(shortCode)) {
    shortCode = Math.random().toString(36).substr(2, codeLength);
    attempt++;
    if (attempt % 10 === 0)
      codeLength++;
    if (attempt >= 30)
      throw `It's not over when you lose, it's over when you give up`;
  }
  return shortCode;
}

module.exports = {generateLink};
