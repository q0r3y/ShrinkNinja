'use strict';

function resFormat(res, msg, fs) {
  if (!fs) {
    fs = `2em`;
  }
  res.format({
    'text/plain': function () { // For curl usage
      res.send(msg);
    },
    'text/html': function () {
      res.send(`
            <!DOCTYPE html>
            <script>function c(e) {console.log(e.innerText);
             navigator.clipboard.writeText(e.innerText);}</script>
            <body style="background:black;">
            <p onclick="c(this)" style="font-size:${fs};color:white;text-align:center;
            word-break:break-all;padding:40vh 5vw 40vh 5vw; 
            margin:auto">${msg}</p>
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
