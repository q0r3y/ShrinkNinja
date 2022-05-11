'use strict';
const SHORT_URL = `nin.sh`;
const Link = require('../models/Link');

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
              handleError(err, res);
            });
        })
        .catch((err) => {
          handleError(err, res);
        });
    } catch (err) {
      handleError(err, res);
    }
  }
}

function handleError(err, res) {
  console.log(`[-] Error: `);
  console.log(err);
  res.status(409).json({
    status: 'failed',
    error: `Unable to process your request, try again later.`
  });
}

async function generateShortCode() {
  let attempt = 1;
  let shortCode = Math.random().toString(36).substr(2, 5);
  while (await isCodeInUse(shortCode)) {
    console.log(`[*] Found duplicate path. Generating new code...`);
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

module.exports = {generateLink, getLink};
