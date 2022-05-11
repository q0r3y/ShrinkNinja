'use strict';

function resFormat(res, msg, fs) {
  if (!fs) {
    fs = `3em`;
  }
  res.format({
    'text/plain': function () { // For curl usage
      res.send(msg);
    },
    'text/html': function () {
      res.send(`
            <!DOCTYPE html>
            <script>function c(e) {
              navigator.clipboard.writeText(e.innerText)
              .then(()=>{console.log('Copied');})
              .catch(()=>{console.log('Not copied');})
              ;
            }
            </script><body style="background:black;">
            <p onclick="c(this)" style="font-size:${fs};color:white;text-align:center;
            word-break:break-all;margin:40vh 5vw 40vh 5vw;">${msg}</p>
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
