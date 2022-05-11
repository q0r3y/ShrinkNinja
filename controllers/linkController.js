'use strict';
const SHORT_URL = 'nin.sh';
const Link = require('../models/Link');
const validUrl = require('valid-url');
const resController = require('./resController');

async function unpackShortUrl(req, res) {
  let pathData = req.originalUrl.slice(1);
  let ninEnd = pathData.indexOf(`nin.sh`) + 7;
  let shortCode = pathData.slice(ninEnd, ninEnd + 5);
  let link = await getLink(escape(shortCode));
  if (link) {
    resController.resFormat(res, link['longUrl']);
  } else {
    resController.resFormat(res,
      `The first priority to the ninja is to win without fighting.`);
  }
}

function sendShortLink() {
  return (req, res) => {
    let msg = res.locals['generatedLink']['shortUrl'];
    resController.resFormat(res, msg, '6em');
  }
}

function checkPathForUrl() {
  return async (req, res, next) => {
    let pathData = req.originalUrl.slice(1);
    if (pathData.substring(0,14).includes(`nin.sh`)) {
      await unpackShortUrl(req, res);
    }
    else if (validUrl.isWebUri(pathData)) {
      res.locals['longUrl'] = pathData;
      next();
    } else {
      resController.resFormat(res, // Could return a usage page
        `Man… ninjas are kind of cool… I just don’t know any personally.`);
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
              resController.resError(err, res);
            });
        })
        .catch((err) => {
          resController.resError(err, res);
        });
    } catch (err) {
      resController.resError(err, res);
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
      throw `Number of short codes available is extremely low`;
  }
  return shortCode;
}

async function isCodeInUse(shortCode) {
  let link = await getLink(shortCode);
  return !!link;
}

async function getLink(shortCode) {
  return await Link.findOne({'shortCode': shortCode}).exec();
}

module.exports = {generateLink, getLink, checkPathForUrl, sendShortLink};
