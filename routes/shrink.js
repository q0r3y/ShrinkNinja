'use strict';
const validUrl = require('valid-url');
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/linkController');

router.all('*',
  checkPathForUrl(),
  urlController.generateLink(),
  (req, res) => {
    res.format({
      'text/plain': function () { // For curl usage
        res.send(res.locals['generatedLink']['shortUrl']);
      },
      'text/html': function () {
        res.send(`
            <body style="background:black;">
            <p style="font-size:5em;color:white;text-align:center;
            padding-bottom:40vh;padding-top:40vh; margin:auto">
            ${res.locals['generatedLink']['shortUrl']}<p>
            </body>
        `);
      }
    });
  }
);

async function unpackShortUrl(req, res) {
  let pathData = req.originalUrl.slice(1);
  let ninEnd = pathData.indexOf(`nin.sh`) + 7;
  let shortCode = pathData.slice(ninEnd, ninEnd + 5);
  let link = await urlController.getLink(escape(shortCode));
  if (link) {
    res.format({
      'text/html': function () {
        res.send(`
            <body style="background:black;">
            <p style="font-size:2em;color:white;text-align:center;
            padding-bottom:40vh;padding-top:40vh; margin:auto">
            ${link['longUrl']}<p>
            </body>
        `);
      }
    });
  } else {
    res.socket.destroy();
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
      // Could return a usage page
      return res.socket.destroy();
    }
  };
}

module.exports = router;
