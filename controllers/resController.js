'use strict';

function resFormat(res, msg, fontSize) {
  if (!fontSize) {
    fontSize = `2em`;
  }
  res.format({
    'text/plain': function () { // For curl usage
      res.send(msg);
    },
    'text/html': function () {
      res.send(`
            <body style="background:black;">
            <p style="font-size:${fontSize};color:white;text-align:center;
            padding-bottom:40vh;padding-top:40vh; margin:auto">
            ${msg}<p>
            </body>
        `);
    }
  });
}

function resError(err, res) {
  console.log(`[-] Error: `);
  console.log(err);
  res.status(409).json({
    status: 'err',
    error: `Only a ninja can stop a ninja.`
  });
}

module.exports = {resFormat, resError}
