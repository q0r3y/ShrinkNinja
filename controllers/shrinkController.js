'use strict';
const db = require('../models/database');
const resController = require('./resController');
const expandController = require('./expandController');

function handleParameters() {
  return async (req, res, next) => {
    if (req.body['shrinkUri'].substring(0,14).includes(`nin.sh`)) {
      await expandController.handleShortUrl(req, res);
    } else {
      next();
    }
  };
}

function generateLink() {
  return async (req, res, next) => {
    generateShortCode()
      .then((shortCode) => {
        const data = {
          shortCode : shortCode,
          longUrl: req.body['shrinkUri'],
          singleUse: req.body['singleUse']
        }
        const newLink = db.newLink(data);
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

module.exports = {generateLink, handleParameters};
