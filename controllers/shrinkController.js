'use strict';
const db = require('../models/database');
const resController = require('./resController');

function handleNinLink() {
  return async (req, res, next) => {
    if (req.body['longUrl'].substring(0,14).includes(`nin.sh`)) {
      const reqData = req.body['longUrl'];
      const ninEnd = reqData.indexOf(`nin.sh`) + 7;
      const shortCode = reqData.slice(ninEnd, ninEnd + 5);
      const link = await db.getLink(shortCode);
      if (link) {
        res.json({
          'shortCode':link['shortCode'],
          'shortUrl':link['shortUrl'],
          'longUrl':link['longUrl'],
          'singleUse':link['singleUse'],
          'creationDate':link['creationDate']
        });
      } else {
        const msg = `The first priority to the ninja is to win without fighting.`;
        resController.error(res, 404, msg);
      }
    } else {
      next();
    }
  };
}

function generateLink() {
  return async (req, res, next) => {
    generateShortCode()
      .then((shortCode) => {
        req.body.shortCode = shortCode;
        const newLink = db.newLink(req.body);
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
  let codeLength = 5;
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

module.exports = {generateLink, handleNinLink};
