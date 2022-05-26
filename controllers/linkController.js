'use strict';
const SHORT_URL = 'nin.sh';
const Link = require('../models/Link');
const validUrl = require('valid-url');
const resController = require('./resController');

async function unpackShortUrl(req, res) {
  const reqData = req.body['paramUrl'];
  const ninEnd = reqData.indexOf(`nin.sh`) + 7;
  const shortCode = reqData.slice(ninEnd, ninEnd + 5);
  const link = await getLink(escape(shortCode));
  if (link) {
    res.json({'longUrl':link['longUrl']});
  } else {
    res.json({'error':'The first priority to the ninja is to win without fighting.'});
  }
}

function checkForLongUrl() {
  return async (req, res, next) => {
    const reqData = req.body['paramUrl'];
    if (reqData.substring(0,14).includes(`nin.sh`)) {
      await unpackShortUrl(req, res);
    }
    else if (validUrl.isWebUri(reqData)) {
      res.locals['longUrl'] = reqData;
      next();
    } else {
      res.json({'error':'Man… ninjas are kind of cool… I just don’t know any personally.'});
    }
  };
}

function generateLink() {
  return async (req, res, next) => {
    try {
      generateShortCode()
        .then((generatedPath) => {
          const TEN_DAYS = (10 * 86400000);
          const generatedLink = new Link({
            shortCode: generatedPath,
            longUrl: res.locals['longUrl'],
            shortUrl: `${SHORT_URL}/${generatedPath}`,
            creationDate: Date.now(),
            expirationDate: Date.now() + TEN_DAYS
          });
          generatedLink.save()
            .then(() => {
              res.locals['generatedLink'] = generatedLink;
              next();
            })
            .catch((err) => {
              resController.error(err, res);
            });
        })
        .catch((err) => {
          resController.error(err, res);
        });
    } catch (err) {
      resController.error(err, res);
    }
  }
}

async function generateShortCode() {
  let attempt = 1;
  let shortCode = Math.random().toString(36).substr(2, 5);
  while (await isCodeInUse(shortCode)) {
    shortCode = Math.random().toString(36).substr(2, 5);
    attempt++;
    if (attempt >= 10)
      throw `It's not over when you lose, it's over when you give up`;
  }
  return shortCode;
}

async function isCodeInUse(shortCode) {
  const link = await getLink(shortCode);
  return !!link;
}

async function getLink(shortCode) {
  return await Link.findOne({'shortCode': shortCode}).exec();
}

module.exports = {generateLink, getLink, checkForLongUrl};
