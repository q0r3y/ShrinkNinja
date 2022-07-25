'use strict';
const db = require('../models/database');
const resController = require("./resController");

async function handleShortUrl(req, res) {
  const reqData = req.body['shrinkUri'];
  const ninEnd = reqData.indexOf(`nin.sh`) + 7;
  const shortCode = reqData.slice(ninEnd, ninEnd + 5);
  const link = await db.getLink(escape(shortCode));
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
}

async function expandLink(shortCode) {
  const link = await db.getLink(escape(shortCode));
  if (link) {
    if (link['singleUse'] === true) {
      await db.eraseLink(link['shortCode']);
    }
  }
  return link;
}

module.exports = {handleShortUrl, expandLink}
