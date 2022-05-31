'use strict';
const db = require('../models/database');
const resController = require("./resController");

function checkForShortUrl() {
  return async (req, res, next) => {
    if (req.body['shrinkUri'].substring(0,14).includes(`nin.sh`)) {
      const reqData = req.body['shrinkUri'];
      const ninEnd = reqData.indexOf(`nin.sh`) + 7;
      const shortCode = reqData.slice(ninEnd, ninEnd + 5);
      const link = await expandLink(shortCode);
      if (link) {
        res.json({
          'shortCode':link['shortCode'],
          'shortUrl':link['shortUrl'],
          'longUrl':link['longUrl'],
          'creationDate':link['creationDate']
        });
      } else {
        const msg = `The first priority to the ninja is to win without fighting.`;
        resController.error(res, 404, msg);
      }
    }
    else {
      next();
    }
  };
}

async function expandLink(shortCode) {
  return await db.getLink(escape(shortCode));
}

module.exports = {checkForShortUrl, expandLink}
