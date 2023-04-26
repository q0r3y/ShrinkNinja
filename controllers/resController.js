'use strict';

function error(res, code, error) {
  res.status(code).json({
    status: 'error',
    error: error || `Only a ninja can stop a ninja.`,
  });
}

function sendShortLink() {
  return (req, res) => {
    const short = res.locals['newLink']['shortUrl'];
    res.json({ shortUrl: short });
  };
}

function sendWebPage() {
  return (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      res.render('../public/min/index.ejs');
    } else {
      res.render('../public/dev/index.ejs');
    }
  };
}

module.exports = { error, sendWebPage, sendShortLink };
