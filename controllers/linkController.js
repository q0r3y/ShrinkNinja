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
    const msg = `The first priority to the ninja is to win without fighting.`;
    resController.error(res, 404, msg);
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
      const msg = `Man… ninjas are kind of cool… I just don’t know any personally.`;
      resController.error(res, 406, msg);
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
              console.log(`[-] Error: ${err}`);
              resController.error(res, 418);
            });
        })
        .catch((err) => {
          resController.error(res, 418, err);
        });
    } catch (err) {
      console.log(`[-] Error: ${err}`);
      resController.error(res, 418);
    }
  }
}

async function generateShortCode() {
  let attempt = 1;
  let codeLength = 4;
  let shortCode = Math.random().toString(36).substr(2, codeLength);
  while (await isCodeInUse(shortCode)) {
    shortCode = Math.random().toString(36).substr(2, codeLength);
    attempt++;
    if (attempt % 10 === 0)
      codeLength++;
    if (attempt % 30 === 0)
      throw `It's not over when you lose, it's over when you give up`;
    console.log(shortCode);
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
